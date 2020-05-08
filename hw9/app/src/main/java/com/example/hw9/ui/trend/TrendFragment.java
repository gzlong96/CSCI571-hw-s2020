package com.example.hw9.ui.trend;

import android.graphics.Color;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;
import androidx.lifecycle.ViewModelProviders;

import com.example.hw9.R;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;

import java.util.ArrayList;

public class TrendFragment extends Fragment {

    private TrendViewModel trendViewModel;
    private LineChart lineChart;
    private TextView trendEditText;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        trendViewModel = new ViewModelProvider(this).get(TrendViewModel.class);
        View root = inflater.inflate(R.layout.fragment_trend, container, false);
        trendEditText = root.findViewById(R.id.trendEditText);
        lineChart = root.findViewById(R.id.lineChart);

        trendViewModel.getText().observe(getViewLifecycleOwner(), new Observer<ArrayList<Entry>>() {
            @Override
            public void onChanged(@Nullable ArrayList<Entry> values) {
                if (values != null && values.size()>0) setData(values);
            }
        });

        trendEditText.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH || actionId == EditorInfo.IME_ACTION_SEND ||
                        (event != null && KeyEvent.KEYCODE_ENTER == event.getKeyCode())) {
                    trendViewModel.loadTrendData(trendEditText.getText().toString());
                }
                return false;
            }
        });

//        trendViewModel.loadTrendData("Coronavirus");
        lineChart.invalidate();
        return root;
    }

    private void setData(ArrayList<Entry> values){
        LineDataSet set1;
        if (lineChart.getData() != null && lineChart.getData().getDataSetCount() > 0) {
            set1 = (LineDataSet) lineChart.getData().getDataSetByIndex(0);
            set1.setLabel("Trending Chart for " + trendEditText.getText().toString());
            set1.setValues(values);
            lineChart.getData().notifyDataChanged();
            lineChart.notifyDataSetChanged();
        } else {
            String query = trendEditText.getText().toString();
            if (query.equals("")){
                query = "CoronaVirus";
            }
            set1 = new LineDataSet(values, "Trending Chart for " + query);

//            set1.enableDashedLine(10f, 5f, 0f);
//            set1.enableDashedHighlightLine(10f, 5f, 0f);
            set1.setColor(0xFF6200EE);
            set1.setCircleColor(0xFF6200EE);
            set1.setLineWidth(1f);
            set1.setCircleRadius(3f);
            set1.setDrawCircleHole(false);
            set1.setValueTextSize(9f);
//            set1.setFormLineWidth(1f);
//            set1.setFormLineDashEffect(new DashPathEffect(new float[]{10f, 5f}, 0f));
//            set1.setFormSize(15.f);

            ArrayList<ILineDataSet> dataSets = new ArrayList<ILineDataSet>();

            dataSets.add(set1);

            LineData data = new LineData(dataSets);

            lineChart.setData(data);

            Legend legend = lineChart.getLegend();
            legend.setTextColor(Color.BLACK);
            legend.setTextSize(14);
            legend.setFormSize(14);
//            legend.setXEntrySpace(100);

            lineChart.getXAxis().setDrawGridLines(false);
            lineChart.getXAxis().setAxisMinimum(0);
//            lineChart.getAxisLeft().setAxisMinimum(0);
//            lineChart.getAxisRight().setAxisMinimum(0);
            lineChart.getAxisLeft().setDrawGridLines(false);
            lineChart.getAxisRight().setDrawGridLines(false);

        }
        lineChart.invalidate();
    }
}
