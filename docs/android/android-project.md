# Android实战项目

## 项目结构

```
app/
├── src/
│   ├── main/
│   │   ├── java/com/example/app/
│   │   │   ├── ui/              # UI层
│   │   │   │   ├── activities/
│   │   │   │   ├── fragments/
│   │   │   │   └── adapters/
│   │   │   ├── viewmodel/        # ViewModel
│   │   │   ├── repository/       # 数据仓库
│   │   │   ├── data/             # 数据层
│   │   │   │   ├── local/        # 本地数据源
│   │   │   │   └── remote/       # 远程数据源
│   │   │   ├── di/               # 依赖注入
│   │   │   └── utils/            # 工具类
│   │   └── res/                  # 资源文件
│   └── test/                     # 测试
├── build.gradle
└── proguard-rules.pro
```

## 完整示例：新闻应用

### 数据模型

```kotlin
// data/model/Article.kt
@Entity(tableName = "articles")
data class Article(
    @PrimaryKey val id: Int,
    val title: String,
    val description: String,
    val url: String,
    val imageUrl: String?,
    val publishedAt: String
)

// 网络响应模型
data class ArticleResponse(
    val articles: List<Article>
)
```

### Repository

```kotlin
// repository/NewsRepository.kt
class NewsRepository(
    private val remoteDataSource: NewsRemoteDataSource,
    private val localDataSource: NewsLocalDataSource
) {
    suspend fun getNews(): Flow<List<Article>> = flow {
        try {
            val articles = remoteDataSource.getNews()
            localDataSource.saveArticles(articles)
            emit(articles)
        } catch (e: Exception) {
            emit(localDataSource.getNews())
            throw e
        }
    }
    
    suspend fun getArticleById(id: Int): Article {
        return localDataSource.getArticleById(id)
    }
}
```

### ViewModel

```kotlin
// viewmodel/NewsViewModel.kt
@HiltViewModel
class NewsViewModel @Inject constructor(
    private val repository: NewsRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow<NewsUiState>(NewsUiState.Loading)
    val uiState: StateFlow<NewsUiState> = _uiState.asStateFlow()
    
    init {
        loadNews()
    }
    
    fun loadNews() {
        viewModelScope.launch {
            _uiState.value = NewsUiState.Loading
            try {
                repository.getNews().collect { articles ->
                    _uiState.value = NewsUiState.Success(articles)
                }
            } catch (e: Exception) {
                _uiState.value = NewsUiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}

sealed class NewsUiState {
    object Loading : NewsUiState()
    data class Success(val articles: List<Article>) : NewsUiState()
    data class Error(val message: String) : NewsUiState()
}
```

### UI层

```kotlin
// ui/fragments/NewsListFragment.kt
@AndroidEntryPoint
class NewsListFragment : Fragment() {
    
    private val viewModel: NewsViewModel by viewModels()
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val binding = FragmentNewsListBinding.inflate(inflater, container, false)
        
        val adapter = NewsAdapter { article ->
            findNavController().navigate(
                NewsListFragmentDirections.actionNewsListToDetail(article.id)
            )
        }
        
        binding.recyclerView.adapter = adapter
        
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.uiState.collect { state ->
                when (state) {
                    is NewsUiState.Loading -> {
                        binding.progressBar.visibility = View.VISIBLE
                    }
                    is NewsUiState.Success -> {
                        binding.progressBar.visibility = View.GONE
                        adapter.submitList(state.articles)
                    }
                    is NewsUiState.Error -> {
                        binding.progressBar.visibility = View.GONE
                        Toast.makeText(context, state.message, Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
        
        return binding.root
    }
}
```

### 依赖注入

```kotlin
// di/NetworkModule.kt
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://newsapi.org/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideNewsApi(retrofit: Retrofit): NewsApi {
        return retrofit.create(NewsApi::class.java)
    }
}
```

## 最佳实践总结

### 1. 架构设计

- **MVVM**: 使用ViewModel管理UI状态
- **Repository模式**: 统一数据源管理
- **依赖注入**: 使用Hilt/Dagger

### 2. 异步处理

- **协程**: 使用Kotlin协程
- **Flow**: 响应式数据流
- **StateFlow**: UI状态管理

### 3. 性能优化

- **RecyclerView**: 使用DiffUtil优化列表
- **图片加载**: Glide/Coil
- **数据库**: Room with Flow
- **网络缓存**: OkHttp缓存策略

### 4. 测试

- **单元测试**: JUnit + Mockito
- **UI测试**: Espresso
- **Repository测试**: 测试数据源切换
