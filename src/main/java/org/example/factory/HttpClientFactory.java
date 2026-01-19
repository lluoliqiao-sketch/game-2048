package org.example.factory;

import com.squareup.okhttp.OkHttpClient;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class HttpClientFactory {

    private OkHttpClient client;

    public OkHttpClient getClient() {
        if (client == null) {
            client = new OkHttpClient();
            client.setConnectTimeout(60, TimeUnit.SECONDS);
            client.setReadTimeout(60, TimeUnit.SECONDS);
        }
        return client;
    }
}
