package com.example.hw9.ui.section;

import androidx.lifecycle.ViewModelProviders;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.viewpager2.widget.ViewPager2;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.hw9.R;
import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

public class SectionFragment extends Fragment {

    private SectionViewModel mViewModel;

    public static SectionFragment newInstance() {
        return new SectionFragment();
    }

    public static String[] sectioinNames = {"World", "Business", "Politics", "Sports", "Technology", "Science"};

    SectionAdapter sectionAdapter;
    ViewPager2 viewPager;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.section_fragment, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        sectionAdapter = new SectionAdapter(this);
        viewPager = view.findViewById(R.id.section_viewpager);
        viewPager.setAdapter(sectionAdapter);

        TabLayout tabLayout = view.findViewById(R.id.section_tab);
        new TabLayoutMediator(tabLayout, viewPager,
                (tab, position) -> tab.setText(sectioinNames[position])
        ).attach();
    }

}


