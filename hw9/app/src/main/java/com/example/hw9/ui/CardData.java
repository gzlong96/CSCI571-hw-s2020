package com.example.hw9.ui;

import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.cardview.widget.CardView;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Locale;

public class CardData {
    public String title;
    public String date;
    public String imgUrl;
    public String articleId;
    public String section;
    public String articleUrl;
    public boolean marked;

    public CardData(JSONObject data) throws JSONException {
        title = data.getString("title");
        date = data.getString("date");
        imgUrl = data.getString("image");
        section = data.getString("sectionId");
        articleId = data.getString("id");
        articleUrl = data.getString("url");
    }

    public CardData(CardData cardData){
        title = cardData.title;
        date = cardData.date;
        imgUrl = cardData.imgUrl;
        articleId = cardData.articleId;
        section = cardData.section;
        articleUrl = cardData.articleUrl;
        marked = cardData.marked;
    }

    public CardData(String stringData){
        String[] splited = stringData.split(",-,");
        title = splited[0];
        date = splited[1];
        imgUrl = splited[2];
        articleId = splited[3];
        section = splited[4];
        articleUrl = splited[5];
        marked = true;
    }

    @NonNull
    public String toString(){
        return title + ",-," + date + ",-," + imgUrl + ",-," + articleId + ",-," + section + ",-," + articleUrl;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public String getSub() throws ParseException {
        Instant now = Instant.now();

        Instant pt = Instant.parse(date);

        long diffAsSeconds = ChronoUnit.SECONDS.between(pt, now); // 方法2
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd.HH:mm:ss", Locale.ENGLISH);
//        Date pt = sdf.parse(date);
//
//        if (zdt.getYear()-pt.getYear()>0)
//        Long delta_time = zdt.getTime() sdf.parse(date)
        if (diffAsSeconds<60){
            return diffAsSeconds + "s ago | " + section;
        }
        if (diffAsSeconds<3600){
            return diffAsSeconds/60 + "m ago | " + section;
        }
        else{
            return diffAsSeconds/3600 + "h ago | " + section;
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public String getSubB() throws ParseException {
        Instant instant = Instant.parse(date);
        ZonedDateTime zonedDateTime = ZonedDateTime.ofInstant(instant, ZoneId.of("America/Los_Angeles"));
        return DateTimeFormatter.ofPattern("dd MMM").format(zonedDateTime) + " | " + section;
    }
}
