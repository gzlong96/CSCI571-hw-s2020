package com.example.hw9.ui.search;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.app.SearchManager;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.hw9.R;
import com.example.hw9.ui.CardData;

import java.util.List;

public class SearchActivity extends AppCompatActivity {
    private String query;
    private List<CardData> myDataset;

    private SearchViewModel searchViewModel;
    private RecyclerView recyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager layoutManager;
    private SwipeRefreshLayout mSwipeRefreshLayout;

    private LinearLayout pb_layout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        Intent intent = getIntent();
        query = intent.getStringExtra(SearchManager.QUERY);

        Toolbar myToolbar = findViewById(R.id.search_toolbar);
        myToolbar.setTitle("Search Results for "+query);
        setSupportActionBar(myToolbar);
        ActionBar ab = getSupportActionBar();
        ab.setDisplayHomeAsUpEnabled(true);

        searchViewModel = new ViewModelProvider(this).get(SearchViewModel.class);

        searchViewModel.getData().observe(this, new Observer<List<CardData>>() {
            @Override
            public void onChanged(List<CardData> cardData) {
                System.out.println(cardData);
                if (cardData.size()>0) pb_layout.setVisibility(View.GONE);
                mAdapter.notifyDataSetChanged();
            }
        });

        pb_layout = findViewById(R.id.search_pb_layout);

        mSwipeRefreshLayout = findViewById(R.id.search_swiperefresh_items);
        mSwipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                searchViewModel.loadData(query);
                final Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        if(mSwipeRefreshLayout.isRefreshing()) {
                            mSwipeRefreshLayout.setRefreshing(false);
                        }
                    }
                }, 600);
            }
        });

        recyclerView = findViewById(R.id.search_recycler_view);
        layoutManager = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false);
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.addItemDecoration(new DividerItemDecoration(this,DividerItemDecoration.VERTICAL));
        searchViewModel.loadData(query);
        myDataset = searchViewModel.getData().getValue();
        mAdapter = new SearchAdapter(this, myDataset);
        recyclerView.setAdapter(mAdapter);
    }

    @Override
    public void onResume() {
        mAdapter.notifyDataSetChanged();
        super.onResume();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the options menu from XML
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.search_toolbar, menu);

        return true;
    }

    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
