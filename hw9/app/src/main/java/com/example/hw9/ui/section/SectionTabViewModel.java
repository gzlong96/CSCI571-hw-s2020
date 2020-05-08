package com.example.hw9.ui.section;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.example.hw9.RequestApp;
import com.example.hw9.ui.CardData;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

public class SectionTabViewModel extends ViewModel {
    // TODO: Implement the ViewModel
    private MutableLiveData<List<CardData>> mCards;

    public SectionTabViewModel() {
        mCards = new MutableLiveData<>();
        mCards.setValue(new ArrayList<CardData>());
    }

    LiveData<List<CardData>> getData() {
        return mCards;
    }

    void loadData(String sectionName){
        // Request a string response from the provided URL.
        JsonArrayRequest stringRequest = new JsonArrayRequest(Request.Method.GET,
                "https://hw9backend-275121.wm.r.appspot.com/s?section=" + sectionName, null,
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
