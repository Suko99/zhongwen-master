package com.zhongwenmaster.app;

import android.os.Bundle;
import android.webkit.HttpAuthHandler;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {

    private static final String HTTP_AUTH_USER = "user";
    private static final String HTTP_AUTH_PASSWORD = "GtYC1PBtKd4Fia5BYT9Q";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final Bridge bridge = this.getBridge();
        bridge.getWebView().setWebViewClient(new BridgeWebViewClient(bridge) {
            @Override
            public void onReceivedHttpAuthRequest(WebView view, HttpAuthHandler handler, String host, String realm) {
                handler.proceed(HTTP_AUTH_USER, HTTP_AUTH_PASSWORD);
            }
        });
    }
}
