package com.example.hw9;

import android.annotation.SuppressLint;
import android.app.Application;
import android.content.Context;
import android.location.Geocoder;

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;

import java.util.Locale;


public class RequestApp extends Application {
    private static RequestApp mInstance;
    private static RequestQueue queue;
    private static FusedLocationProviderClient fusedLocationClient;
    private static Geocoder geocoder;
    @Override
    public void onCreate() {
        super.onCreate();
        mInstance = this;
        queue = Volley.newRequestQueue(getApplicationContext());
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        geocoder = new Geocoder(this, Locale.getDefault());
    }
    public static synchronized RequestApp getInstance() {
        return mInstance;
    }

    public static Context getAppContext() {
        return mInstance.getApplicationContext();
    }

    public static RequestQueue getHttpQueue(){
        return queue;
    }

    public static FusedLocationProviderClient getLocationProvider(){return fusedLocationClient;}

    public static Geocoder getGeocoder(){ return geocoder;}
}
