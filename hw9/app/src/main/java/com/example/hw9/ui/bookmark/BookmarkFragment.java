package com.example.hw9.ui.bookmark;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.example.hw9.R;
import com.example.hw9.ui.CardData;

import java.util.List;
import java.util.Map;

public class BookmarkFragment extends Fragment {
    private List<CardData> myDataset;

    private BookmarkViewModel bookmarkViewModel;
    private RecyclerView recyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager layoutManager;

    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;

    private LinearLayout pb_layout;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        System.out.println("Main activity onCreateView");
        bookmarkViewModel = new ViewModelProvider(this).get(BookmarkViewModel.class);
        bookmarkViewModel.getData().observe(getViewLifecycleOwner(), new Observer<List<CardData>>() {
            @Override
            public void onChanged(List<CardData> cardData) {
                System.out.println("bookmark data changed");
                if (cardData.size()>0) pb_layout.setVisibility(View.GONE);
                else pb_layout.setVisibility(View.VISIBLE);
                mAdapter.notifyDataSetChanged();
            }
        });

        View root = inflater.inflate(R.layout.fragment_bookmark, container, false);

        pb_layout = root.findViewById(R.id.bookmark_result_text_layout);

        sharedPreferences = requireContext().getSharedPreferences("bookmark", 0);
        editor = sharedPreferences.edit();

        recyclerView = (RecyclerView) root.findViewById(R.id.bookmark_rec);
        layoutManager = new GridLayoutManager(getContext(), 2);
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.addItemDecoration(new DividerItemDecoration(requireContext(),DividerItemDecoration.VERTICAL));
        myDataset = bookmarkViewModel.getData().getValue();
        mAdapter = new BookmarkAdapter(getContext(), myDataset, pb_layout);
        loadData();
        recyclerView.setAdapter(mAdapter);
        return root;
    }

    void loadData(){
        List<CardData> newCards = bookmarkViewModel.getData().getValue();
        assert newCards != null;
        newCards.clear();

        Map<String, ?> allBookmarks = sharedPreferences.getAll();
        for(Map.Entry<String, ?>  entry : allBookmarks.entrySet()){
            newCards.add(new CardData((String)entry.getValue()));
        }

        if (newCards.size()>0) pb_layout.setVisibility(View.GONE);
        else pb_layout.setVisibility(View.VISIBLE);

        mAdapter.notifyDataSetChanged();
    }

    @Override
    public void onResume() {
        loadData();
        super.onResume();
    }
}
