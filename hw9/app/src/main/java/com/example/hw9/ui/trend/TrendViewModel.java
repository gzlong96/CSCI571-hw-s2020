package com.example.hw9.ui.trend;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.example.hw9.RequestApp;
import com.example.hw9.ui.CardData;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

public class TrendViewModel extends ViewModel {

    private MutableLiveData<ArrayList<Entry>> mDataset;

    public TrendViewModel() {
        mDataset = new MutableLiveData<>();
        mDataset.setValue(new ArrayList<Entry>());
        loadTrendData("Coronavirus");
    }

    public LiveData<ArrayList<Entry>> getText() {
        return mDataset;
    }

    public void loadTrendData(String q){
        JsonArrayRequest stringRequest = new JsonArrayRequest(Request.Method.GET,
                "https://hw9backend-275121.wm.r.appspot.com/trend?q="+q, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        // Display the first 500 characters of the response string.
                        ArrayList<Entry> values = mDataset.getValue();
                        assert values != null;
                        values.clear();
                        for (int i = 0; i < response.length(); i++) {
                            try {
                                values.add(new Entry(i, response.getInt(i)));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                        mDataset.postValue(values);
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