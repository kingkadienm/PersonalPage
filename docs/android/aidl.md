# AIDL 进程间通信


项目目录

![photo](/image/Snipaste_2019-07-31_16-38-02.png)

分为了两个App一个lib依赖， 其中aidl文件、实体类、和服务写在aidl_library中，然后oneApp和twoApp分别依赖此lib。下面开始仔细讲讲其中的使用方式。先从AIDL文件说起

* AIDL文件 

AIDL接口传递的主要是一个自定义类型User，所以先创建User文件，需要实现序列化
```User.java
package com.wangzs.aidl_library;

import android.os.Parcel;
import android.os.Parcelable;


/**
 * @Description:
 * @Author:  wangzs
 * @Date:    2019-07-31 10:42
 * @Version:
 * @Email    wangzs@yuntongxun.com
 */
public class User implements Parcelable {

    public int userId;

    public String userName;

    public String userSex;

    public User() {
    }

    protected User(Parcel in) {
        userId = in.readInt();
        userName = in.readString();
        userSex = in.readString();
    }

    public static final Creator<User> CREATOR = new Creator<User>() {
        @Override
        public User createFromParcel(Parcel in) {
            return new User(in);
        }

        @Override
        public User[] newArray(int size) {
            return new User[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(userId);
        dest.writeString(userName);
        dest.writeString(userSex);
    }

    public void readFromParcel(Parcel in) {
        userId = in.readInt();
        userName = in.readString();
        userSex = in.readString();
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", userSex='" + userSex + '\'' +
                '}';
    }
}

```
创建User.aidl文件，声明 parcelable User; （注意: 因为前面创建了User.class, 此时再创建User.aidl会提示名字冲突错误导致无法创建，可以先随便起个名字，创建完后再改成User）

```aidl
// User.aidl
package com.wangzs.aidl_library;

parcelable User;

```

 创建AIDL接口，IUserCallBack.aidl文件，这里定义了一个add方法和一个get方法
 ```aidl
 
// IUserCallBack.aidl
package com.wangzs.aidl_library;

// 导入User的路径
import com.wangzs.aidl_library.User;

// Declare any non-default types here with import statements

interface IUserCallBack {

    /**
     * 申明为 inout 时需要手动在User.class添加readFromParcel()方法
     */
     void addUser(inout User user);

     User getUser();

}

```
* 注：这里重点是in、out、inout修饰符以及Parcelable的使用！常见的是in、Parcelable，少用的out、inout。
   这几种修饰符，可理解如下：
   
   in：客户端的参数输入；
   
   out：服务端的参数输入；
   
   inout：这个可以叫输入输出参数，客户端可输入、服务端也可输入。客户端输入了参数到服务端后，服务端也可对该参数进行修改等，最后在客户端上得到的是服务端输出的参数。
  如果类型申明为inout，则需要在User.class中手动添加readFromParcel方法，因为这个方法无法自动生成
  
最后我们需要一个Service来帮助实现建立桥梁，在Service中我们需要实现IuserCallBack接口然后和Service的onBind进行联系。
```java
package com.wangzs.aidl_library;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.os.RemoteException;
import android.support.annotation.Nullable;

import java.util.concurrent.CopyOnWriteArrayList;


/**
 * @Description:
 * @Author: wangzs
 * @Date: 2019-07-31 10:39
 * @Version:
 * @Email wangzs@yuntongxun.com
 */


public class UserService extends Service {

    // 支持并发读写
    private CopyOnWriteArrayList<User> users = new CopyOnWriteArrayList<>();

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return mStub;
    }

    IUserCallBack.Stub mStub = new IUserCallBack.Stub() {
        @Override
        public void addUser(User user) throws RemoteException {
            users.clear();
            users.add(user);
        }

        @Override
        public User getUser() throws RemoteException {
            return users.get(0);
        }
    };

}

```
服务创建好了当然也不要忘记注册这个服务，在AndroidManifest.xml进行注册，因为跨进程所以属性exported为true，代表可以被其他appliction启动；还需要定义好启动服务的Action。

```service
  <service
            android:name="com.wangzs.aidl_library.UserService"
            android:enabled="true"
            android:exported="true"
            android:process=":remote">
            <intent-filter>
                <!-- 定义Action -->
                <action android:name="aidl_user_service" />
            </intent-filter>
        </service>

```
到此，AIDL的”服务端“算是完成了。

自定义类型需要实现Parcelable接口
名字冲突错误导致无法创建，可以先随便起个名字，创建完后再改成和AIDL文件名字一致。
如果类型申明为inout，则需要在User.class中手动添加readFromParcel方法。
注册Service时需要添加exported=true，并定义Action。

* 数据传递
完成后咱们就来开始实现两个App之间的数据传递。我们需要从App1跳转到App2，然后由App2来发送数据，所以首选要知道跳转到App2的哪个页面，然后在清单文件中在该Activity添加android:exported=true允许被其他Appliction调用（这种方式不建议, 最好通过定义uri的方式进行跳转）

```
<activity
      android:name=".MainTwoActivity"
      android:exported="true"/>
```
然后从App1编写跳转到该MainTwoActivity的代码 （这种方式不建议, 最好通过定义uri的方式进行跳转），

```
    private String TAG = "wangzs";
    IUserCallBack callBack = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        findViewById(R.id.btnLogin).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (!isApkInstalled("com.wangzs.twoapp")) {
                    return;
                }
            }
        });
    }
    public boolean isApkInstalled(String packageName) {
        if (TextUtils.isEmpty(packageName)) {
            return false;
        }
        try {
            ApplicationInfo info = getPackageManager().getApplicationInfo(packageName, PackageManager.GET_UNINSTALLED_PACKAGES);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (conn!=null) {
            unbindService(conn);
        }
    }
```
此时如果不出意外的话会正常打开App2的MainTwoActivity的页面, 点击该页面的按钮, 开始发送数据。
先new ServiceConnection可以取到一个IBinder对象, 通过该对象可以拿到我们的之前实现的IUserCallBack实例IUserCallBack callback = IUserCallBack.Stub.asInterface(service)。然后通过call可以调取接口的回调方法callBack.addUser(user);。

```
  private ServiceConnection conn = new ServiceConnection() {
         @Override
         public void onServiceConnected(ComponentName name, IBinder service) {
             callBack = IUserCallBack.Stub.asInterface(service);
             try {
                 User user = new User();
                 user.userId = 101;
                 user.userName = "张三";
                 user.userSex = "男";
                 callBack.addUser(user);
                 Log.e(TAG, "发送数据  == " + user.toString());
                 Toast.makeText(MainTwoActivity.this, "发送成功, 数据看Log日志", Toast.LENGTH_LONG).show();
             } catch (RemoteException e) {
                 e.printStackTrace();
             }
         }
 
         @Override
         public void onServiceDisconnected(ComponentName name) {
             callBack = null;
         }
     };
```
有了ServiceConnection我们可以开始绑定服务了，（绑定服务时需要注意的是：Action是注册Service时定义的，Package是发送端的包名），如果isBind返回false则代表服务绑定失败, 就需要查看Action是否和注册时一致，Package是否正确。
```
                // 这里以包名跳转
                Intent intent = new Intent(Intent.ACTION_MAIN);
                // 参数1:目标包名 参数2:目标activity的具体路径
                ComponentName componentName = new ComponentName("com.wangzs.twoapp", "com.wangzs.twoapp.MainTwoActivity");
                intent.setComponent(componentName);
                startActivity(intent);
```
App2的数据已经发送了, 那么我们回到App1中接收数据，接收数据也很简单，可以把代码copy过来，把addUser()改为getUser()。

```
 private ServiceConnection conn = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            callBack = IUserCallBack.Stub.asInterface(service);
            try {
                User user = callBack.getUser();
                if (user != null) {
                    Log.e(TAG, "接收数据  == " + user.toString());
                    Toast.makeText(MainOneActivity.this, "接收到数据, 数据看Log日志", Toast.LENGTH_LONG).show();
                }
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            callBack = null;
        }
    };

```
绑定服务的代码可以copy过来, 一定要注意的是, 接收数据时Intent的Package也一定是发送端的包名，也就是App2的包名。不然bindService会返回false。
最后不要忘记在销毁页面时unbindService(conn);

纠结的地方：App2发送数据后页面关闭时调用onDestroy,在该回调中调用unbindService(conn), 会导致App1接收的数据为null。切记切记...

再总结一下数据传递时容易发生的坑

目标Activity要exported=true (建议使用uri方式)
Action是注册Service时定义的
不管在哪个App绑定service, intent的Package一定是发送数据端的包名。
bindService返回true时多检查action和package。

[Demo地址](https://github.com/kingkadienm/AndroidAIDL)