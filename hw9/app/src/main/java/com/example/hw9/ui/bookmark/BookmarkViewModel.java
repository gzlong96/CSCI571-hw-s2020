package com.example.hw9.ui.bookmark;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.hw9.ui.CardData;

import java.util.ArrayList;
import java.util.List;

public class BookmarkViewModel extends ViewModel {

    private MutableLiveData<List<CardData>> mCards;

    public BookmarkViewModel() {
        mCards = new MutableLiveData<>();
        mCards.setValue(new ArrayList<CardData>());
    }

    LiveData<List<CardData>> getData() {
        return mCards;
    }

}