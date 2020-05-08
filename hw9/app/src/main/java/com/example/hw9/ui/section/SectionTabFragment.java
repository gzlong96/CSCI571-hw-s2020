package com.example.hw9.ui.section;

import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.lifecycle.ViewModelProviders;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.hw9.R;
import com.example.hw9.ui.CardData;

import java.util.List;

public class SectionTabFragment extends Fragment {
    private List<CardData> myDataset;
    private String sectionName;

    private SectionTabViewModel sectionTabViewModel;
    private RecyclerView recyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager layoutManager;
    private SwipeRefreshLayout mSwipeRefreshLayout;

    private LinearLayout pb_layout;

    public static SectionTabFragment newInstance() {
        return new SectionTabFragment();
    }


    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        Bundle args = getArguments();
        sectionName = args.getString("sectionName");


        sectionTabViewModel = new ViewModelProvider(this).get(SectionTabViewModel.class);

        sectionTabViewModel.getData().observe(getViewLifecycleOwner(), new Observer<List<CardData>>() {
            @Override
            public void onChanged(List<CardData> cardData) {
                if (cardData.size()>0) pb_layout.setVisibility(View.GONE);
                mAdapter.notifyDataSetChanged();
            }
        });

        View root = inflater.inflate(R.layout.section_tab_fragment, container, false);

        pb_layout = root.findViewById(R.id.section_pb_layout);

        mSwipeRefreshLayout = root.findViewById(R.id.section_swiperefresh_items);
        mSwipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                sectionTabViewModel.loadData(sectionName);
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

        recyclerView = (RecyclerView) root.findViewById(R.id.section_recycler_view);
        layoutManager = new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false);
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.addItemDecoration(new DividerItemDecoration(requireContext(),DividerItemDecoration.VERTICAL));
        sectionTabViewModel.loadData(sectionName);
        myDataset = sectionTabViewModel.getData().getValue();
        mAdapter = new SectionTabAdapter(getContext(), myDataset);
        recyclerView.setAdapter(mAdapter);

        return root;
    }

    @Override
    public void onResume() {
        mAdapter.notifyDataSetChanged();
        super.onResume();
    }

}
