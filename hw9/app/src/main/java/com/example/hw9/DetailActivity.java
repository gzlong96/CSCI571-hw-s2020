package com.example.hw9;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Paint;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.Html;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.bumptech.glide.Glide;
import com.example.hw9.ui.CardData;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class DetailActivity extends AppCompatActivity {

    private ImageView imgView;
    private TextView titleView;
    private TextView sectionView;
    private TextView dateView;
    private TextView htmlView;
    private TextView fullView;
    private Context mContext;

    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;

    String articleID;
    String articleTitle;
    String articleUrl;
    String date;
    String imgUrl;
    String section;

    private Toolbar.OnMenuItemClickListener onMenuItemClick = new Toolbar.OnMenuItemClickListener() {
        @Override
        public boolean onMenuItemClick(MenuItem item) {
            if (item.getItemId() == R.id.detail_tb_twitter) {
                Uri uri = Uri.parse("https://twitter.com/intent/tweet?text=Check out this link:\n&url="+
                        articleUrl + "&hashtags=CSCI571NewsSearch");
                Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                mContext.startActivity(intent);
                return true;
            }
            if (item.getItemId() == R.id.detail_tb_bookmark) {
                if (sharedPreferences.contains(articleID)){
//                        System.out.println("remove bookmark");
                    editor.remove(articleID);
                    editor.commit();
                    item.setIcon(R.drawable.ic_bookmark_border_24px);
                    Toast.makeText(mContext, "\"" + articleTitle + "\" bookmark removed!",
                            Toast.LENGTH_SHORT).show();
                }
                else {
                    editor.putString(articleID, articleTitle + ",-," + date + ",-," + imgUrl + ",-," + articleID + ",-," + section + ",-," + articleUrl);
                    editor.commit();
                    item.setIcon(R.drawable.ic_bookmark_24px);
                    Toast.makeText(mContext, "\"" + articleTitle + "\" added to bookmark!",
                            Toast.LENGTH_SHORT).show();
                }
                return true;
            }
            return true;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTheme(R.style.AppTheme);
        setContentView(R.layout.activity_detail);

        sharedPreferences = this.getSharedPreferences("bookmark", 0);
        editor = sharedPreferences.edit();

        Intent intent = getIntent();
        articleID = intent.getStringExtra("id");
        articleTitle = intent.getStringExtra("title");

        Toolbar myToolbar = (Toolbar) findViewById(R.id.detail_toolbar);
        myToolbar.setTitle(articleTitle);

        setSupportActionBar(myToolbar);
        myToolbar.setOnMenuItemClickListener(onMenuItemClick);
        ActionBar ab = getSupportActionBar();
        ab.setDisplayHomeAsUpEnabled(true);

        mContext = this;

        // Capture the layout's TextView and set the string as its text
        imgView = findViewById(R.id.detail_img);
        titleView = findViewById(R.id.detail_title);
        sectionView = findViewById(R.id.detail_section);
        dateView = findViewById(R.id.detail_date);
        htmlView = findViewById(R.id.detail_html);
        fullView = findViewById(R.id.detail_full_article);
        fullView.getPaint().setFlags(Paint.UNDERLINE_TEXT_FLAG );

//        textView.setText(title);
        loadCards();
    }

    void loadCards(){
        // Request a string response from the provided URL.
        JsonObjectRequest stringRequest = new JsonObjectRequest(Request.Method.GET,
                "https://hw9backend-275121.wm.r.appspot.com/gd?id=" + articleID, null,
                new Response.Listener<JSONObject>() {
                    @RequiresApi(api = Build.VERSION_CODES.O)
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            articleUrl = response.getString("url");
                            titleView.setText(response.getString("title"));
                            section = response.getString("sectionId");
                            sectionView.setText(section);
                            date = response.getString("date");
                            dateView.setText(dateFormat(date));
                            htmlView.setText(Html.fromHtml(response.getString("description")));
                            imgUrl = response.getString("image");
                            Glide.with(mContext)
                                    .load(imgUrl)
                                    .into(imgView);
                            findViewById(R.id.detail_pb_layout).setVisibility(View.GONE);
                            findViewById(R.id.scrollView).setVisibility(View.VISIBLE);
                            fullView.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    Uri uri = Uri.parse(articleUrl);
                                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                                    startActivity(intent);
                                }
                            });
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
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

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the options menu from XML
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.detail_toolbar, menu);

        if (!sharedPreferences.contains(articleID)){
            menu.getItem(0).setIcon(R.drawable.ic_bookmark_border_24px);
        }
        else {
            menu.getItem(0).setIcon(R.drawable.ic_bookmark_24px);
        }

        return true;
    }

    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private String dateFormat(String date){
        Instant instant = Instant.parse(date);
        ZonedDateTime zonedDateTime = ZonedDateTime.ofInstant(instant, ZoneId.of("America/Los_Angeles"));
        return DateTimeFormatter.ofPattern("dd MMM yyyy").format(zonedDateTime);
    }
}
