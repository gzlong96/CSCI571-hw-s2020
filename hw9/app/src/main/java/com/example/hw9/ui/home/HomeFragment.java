package com.example.hw9.ui.home;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Criteria;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.hw9.R;
import com.example.hw9.RequestApp;
import com.example.hw9.ui.CardData;
import com.example.hw9.ui.WeatherData;
import com.google.android.gms.tasks.OnSuccessListener;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.Executor;

public class HomeFragment extends Fragment {
    public static final int MY_PERMISSIONS_REQUEST_LOCATION = 99;

    private HomeViewModel homeViewModel;
    private List<CardData> myDataset;
    private WeatherData myWeather;

    private RecyclerView recyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager layoutManager;

    public LocationManager locationManager;
    public Criteria criteria;
    public String bestProvider;

    private LinearLayout pb_layout;

    private String weatherKey = "d0fe279dbfba3d4075681a511ed4f45a";

    private SwipeRefreshLayout mSwipeRefreshLayout;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
//        System.out.println("Fragment onCreateView");

        homeViewModel = new ViewModelProvider(requireActivity()).get(HomeViewModel.class);

        homeViewModel.getData().observe(getViewLifecycleOwner(), new Observer<List<CardData>>() {
            @Override
            public void onChanged(List<CardData> cardData) {
//                myDataset = cardData;
                if (cardData.size() > 0) pb_layout.setVisibility(View.GONE);
                mAdapter.notifyDataSetChanged();
            }
        });

        View root = inflater.inflate(R.layout.fragment_home, container, false);

        pb_layout = root.findViewById(R.id.home_pb_layout);

        mSwipeRefreshLayout = root.findViewById(R.id.home_swiperefresh_items);
        mSwipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
//                System.out.println("refresh");
                homeViewModel.loadData();
                loadWeather();
                final Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        if (mSwipeRefreshLayout.isRefreshing()) {
                            mSwipeRefreshLayout.setRefreshing(false);
                        }
                    }
                }, 600);
            }
        });

        recyclerView = (RecyclerView) root.findViewById(R.id.home_recycler_view);


//        homeViewModel.loadData();
        layoutManager = new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false);
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.addItemDecoration(new DividerItemDecoration(requireContext(), DividerItemDecoration.VERTICAL));
        myDataset = homeViewModel.getData().getValue();
        myWeather = homeViewModel.getWeather().getValue();
        mAdapter = new HomeAdapter(getContext(), myDataset, myWeather);
        recyclerView.setAdapter(mAdapter);
        loadWeather();
//        checkLocationPermission();
        // specify an adapter (see also next example)
//        System.out.println("return root");
//        System.out.println(myDataset);
        return root;
    }

    @Override
    public void onResume() {
        mAdapter.notifyDataSetChanged();
        super.onResume();
    }

    @SuppressLint("MissingPermission")
    private void loadWeather() {
        locationManager = (LocationManager) requireContext().getSystemService(Context.LOCATION_SERVICE);
        criteria = new Criteria();
        bestProvider = String.valueOf(locationManager.getBestProvider(criteria, true));

        System.out.println(bestProvider);

        //You can still do this if you like, you might get lucky:
//        if (ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//            // TODO: Consider calling
//            //    ActivityCompat#requestPermissions
//            // here to request the missing permissions, and then overriding
//            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
//            //                                          int[] grantResults)
//            // to handle the case where the user grants the permission. See the documentation
//            // for ActivityCompat#requestPermissions for more details.
//            return;
//        }
        Location location = locationManager.getLastKnownLocation(bestProvider);
//        System.out.println("try to get location");
        if (location != null) {
//            System.out.println("location not null");
            location2weather(location);
        }
        else{
            //This is what you need:
//            System.out.println("location is null");
            locationManager.requestLocationUpdates(bestProvider, 1000, 0, new LocationListener(){

                @Override
                public void onLocationChanged(Location location) {
//                    System.out.println("onLocationChanged");
                    locationManager.removeUpdates(this);
                    //open the map:
                    location2weather(location);
                }

                @Override
                public void onStatusChanged(String provider, int status, Bundle extras) {
                }

                @Override
                public void onProviderEnabled(String provider) {
                }

                @Override
                public void onProviderDisabled(String provider) {
                }
            });
        }
    }


    void location2weather(Location location) {
        Geocoder geocoder = RequestApp.getGeocoder();
        List<Address> addresses = null;
        try {
            addresses = geocoder.getFromLocation(location.getLatitude(), location.getLongitude(), 1);
        } catch (IOException e) {
            e.printStackTrace();
        }
        String cityName = addresses.get(0).getLocality();
        String stateName = addresses.get(0).getAdminArea();
//                    String countryName = addresses.get(0).getAddressLine(2);
//        System.out.println("trans to weather");
//        System.out.println(addresses.get(0).getAdminArea());
//        System.out.println(addresses.get(0).getLocality());
        getWeatherInfo(cityName, stateName);
    }

    void getWeatherInfo(String cityName, String stateName){
        JsonObjectRequest stringRequest = new JsonObjectRequest(Request.Method.GET,
                "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=metric&appid="+weatherKey,
                null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        String weather = null;
                        String temp = null;
                        Objects.requireNonNull(myWeather).city = cityName;
                        myWeather.state = stateName;
                        try {
                            weather = response.getJSONArray("weather").getJSONObject(0).getString("main");
                            temp = response.getJSONObject("main").getString("temp");
                        } catch (JSONException e) {
                            System.out.println("Json parse error");
                            e.printStackTrace();
                        }
                        myWeather.ChangeData(cityName, stateName, temp, weather);
                        mAdapter.notifyDataSetChanged();
                        System.out.println("Weather notification");
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println(error.toString());
            }
        });
        RequestApp.getHttpQueue().add(stringRequest);
    }

}

