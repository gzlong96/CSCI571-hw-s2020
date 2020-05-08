package com.example.hw9.ui.section;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.viewpager2.adapter.FragmentStateAdapter;

public class SectionAdapter extends FragmentStateAdapter {
    public SectionAdapter(Fragment fragment) {
        super(fragment);
    }
    public static String[] sectioinNames = {"world", "business", "politics", "sport", "technology", "science"};

    @NonNull
    @Override
    public Fragment createFragment(int position) {
        // Return a NEW fragment instance in createFragment(int)
        Fragment fragment = new SectionTabFragment();
        Bundle args = new Bundle();
        // Our object is just an integer :-P
        args.putString("sectionName", sectioinNames[position]);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public int getItemCount() {
        return 6;
    }
}
