package com.example.hw9.ui;

import org.json.JSONException;
import org.json.JSONObject;

public class WeatherData {
    public String city;
    public String state;
    public String temp;
    public String weather;
    public WeatherData(){
        city = "City";
        state = "State";
        temp = "Temp";
        weather = "Weather";
    }

    public void ChangeData(String c, String s, String t, String w){
        city = c;
        state = s;
        temp = Math.round(Double.parseDouble(t)) + " ℃";
        weather = w;
    }
}
