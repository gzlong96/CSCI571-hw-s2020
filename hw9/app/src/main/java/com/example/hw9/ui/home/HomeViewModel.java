package com.example.hw9.ui.home;

import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.webkit.ConsoleMessage;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.hw9.RequestApp;
import com.example.hw9.ui.CardData;
import com.example.hw9.ui.WeatherData;
import com.google.android.gms.tasks.OnSuccessListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.Console;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.concurrent.Executor;

public class HomeViewModel extends ViewModel {

    private MutableLiveData<List<CardData>> mCards;
    private MutableLiveData<WeatherData> mWeather;
    private String weatherKey = "d0fe279dbfba3d4075681a511ed4f45a";

    public HomeViewModel() {
        mCards = new MutableLiveData<>();
        mCards.setValue(new ArrayList<CardData>());
        mWeather = new MutableLiveData<>();
        mWeather.setValue(new WeatherData());
        loadData();
    }

    LiveData<List<CardData>> getData() {
        return mCards;
    }

    LiveData<WeatherData> getWeather(){
        return mWeather;
    }

    void loadData(){
//        loadWeather();
        loadCards();
    }

    void loadCards(){
        // Request a string response from the provided URL.
        JsonArrayRequest stringRequest = new JsonArrayRequest(Request.Method.GET,
                "https://hw9backend-275121.wm.r.appspot.com/h", null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        // Display the first 500 characters of the response string.
                        List<CardData> newCards = mCards.getValue();
                        assert newCards != null;
                        newCards.clear();
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                newCards.add(new CardData(response.getJSONObject(i)));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                        mCards.postValue(newCards);
//                        System.out.println("finish get home");
//                        System.out.println(newCards);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println(error.toString());
            }
        });

        // Add the request to the RequestQueue.
        RequestApp.getHttpQueue().add(stringRequest);

    }
}