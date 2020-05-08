package com.example.hw9.ui.home;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.hw9.DetailActivity;
import com.example.hw9.R;
import com.example.hw9.ui.CardData;
import com.example.hw9.ui.WeatherData;

import java.text.ParseException;
import java.util.List;

public class HomeAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private List<CardData> mDataset;
    private WeatherData mWeather;
    public Context mContext;
    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;
    private HomeAdapter adapter_this;

    // Provide a reference to the views for each data item
    // Complex data items may need more than one view per item, and
    // you provide access to all the views for a data item in a view holder
    public static class HomeViewHolder extends RecyclerView.ViewHolder {
        // each data item is just a string in this case
        public TextView titleTextView;
        public ImageView imgView;
        public CardView cardView;
        public ImageView bookmarkView;
        public TextView subView;

        public HomeViewHolder(View v) {
            super(v);
            titleTextView = v.findViewById(R.id.card_text);
            imgView = v.findViewById(R.id.card_img);
            cardView = v.findViewById(R.id.card_view);
            bookmarkView = v.findViewById(R.id.card_bookmark);
            subView = v.findViewById(R.id.card_sub);
        }
    }

    public static class WeatherViewHolder extends RecyclerView.ViewHolder {
        // each data item is just a string in this case
        public TextView cityTextView;
        public TextView stateTextView;
        public TextView tempTextView;
        public TextView weatherTextView;
        public ImageView imgView;

        public WeatherViewHolder(View v) {
            super(v);
            cityTextView = v.findViewById(R.id.weather_city);
            stateTextView = v.findViewById(R.id.weather_state);
            tempTextView = v.findViewById(R.id.weather_temp);
            weatherTextView = v.findViewById(R.id.weather_weather);
            imgView = v.findViewById(R.id.weatherImageView);
        }
    }

    // Provide a suitable constructor (depends on the kind of dataset)
    @SuppressLint("CommitPrefEdits")
    public HomeAdapter(Context context, List<CardData> myDataset, WeatherData myWeather) {
        mDataset = myDataset;
        mWeather = myWeather;
        mContext = context;
        sharedPreferences = mContext.getSharedPreferences("bookmark", 0);
        editor = sharedPreferences.edit();
        adapter_this = this;
    }

    // Create new views (invoked by the layout manager)
    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // create a new view
        if (viewType == 0){
            View v = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.home_weather_view, parent, false);

            return new WeatherViewHolder(v);
        }
        else{
            View v = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.card_view, parent, false);

            HomeViewHolder homeViewHolder = new HomeViewHolder(v);
            homeViewHolder.cardView.setOnClickListener(new View.OnClickListener(){
                @Override
                public void onClick(View v) {
                    int position = homeViewHolder.getAdapterPosition();
                    String articleID = mDataset.get(position-1).articleId;
                    String articleTitle = mDataset.get(position-1).title;
                    Intent intent = new Intent(mContext, DetailActivity.class);
                    intent.putExtra("title", articleTitle);
                    intent.putExtra("id", articleID);
                    mContext.startActivity(intent);
                }
            });

            homeViewHolder.cardView.setOnLongClickListener(new View.OnLongClickListener(){
                @Override
                public boolean onLongClick(View v) {
                    int position = homeViewHolder.getAdapterPosition();
                    final Dialog dialog = new Dialog(mContext);
                    // Include dialog.xml file
                    dialog.setContentView(R.layout.share_dialog);
                    // Set dialog title
//                    dialog.setTitle("Custom Dialog");

                    // set values for custom dialog components - text, image and button
                    TextView dialog_title = dialog.findViewById(R.id.dialog_title);
                    dialog_title.setText(mDataset.get(position-1).title);
                    ImageView image = dialog.findViewById(R.id.dialog_img);
                    Glide.with(mContext)
                            .load(mDataset.get(position-1).imgUrl)
                            .into(image);

                    ImageView twitter = dialog.findViewById(R.id.dialog_twitter);

                    twitter.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            // Close dialog
//                            dialog.dismiss();
                            Uri uri = Uri.parse("https://twitter.com/intent/tweet?text=Check out this link:\n&url="+
                                    mDataset.get(position-1).articleUrl + "&hashtags=CSCI571NewsSearch");
                            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                            mContext.startActivity(intent);
                            System.out.println("twitter clicked");
                        }
                    });

                    ImageView bookmark = dialog.findViewById(R.id.dialog_bookmark);
                    String articleID = mDataset.get(position-1).articleId;
                    if (sharedPreferences.contains(articleID)){
                        bookmark.setImageResource(R.drawable.ic_bookmark_24px);
                    }

                    bookmark.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            int position = homeViewHolder.getAdapterPosition();
//                    System.out.println(position);
                            String articleID = mDataset.get(position-1).articleId;
                            if (sharedPreferences.contains(articleID)){
//                        System.out.println("remove bookmark");
                                editor.remove(articleID);
                                editor.commit();
                                mDataset.get(position - 1).marked = false;
                                mDataset.set(position - 1, new CardData(mDataset.get(position - 1)));
                                bookmark.setImageResource(R.drawable.ic_bookmark_border_24px);
                                Toast.makeText(mContext, "\""+mDataset.get(position - 1).title + "\" bookmark removed!",
                                        Toast.LENGTH_SHORT).show();
                            }
                            else {
//                        System.out.println("add bookmark");
                                editor.putString(articleID, mDataset.get(position-1).toString());
                                editor.commit();
                                System.out.println(sharedPreferences.getString(articleID, null));
                                mDataset.get(position-1).marked = true;
                                mDataset.set(position - 1, new CardData(mDataset.get(position - 1)));
                                bookmark.setImageResource(R.drawable.ic_bookmark_24px);
                                Toast.makeText(mContext, "\""+mDataset.get(position - 1).title + "\" added to bookmark!",
                                        Toast.LENGTH_SHORT).show();
                            }
                            adapter_this.notifyDataSetChanged();
                        }
                    });

                    dialog.show();
                    return true;
                }
            });

            homeViewHolder.bookmarkView.setOnClickListener(new View.OnClickListener(){
                @Override
                public void onClick(View v) {
                    int position = homeViewHolder.getAdapterPosition();
//                    System.out.println(position);
                    String articleID = mDataset.get(position-1).articleId;
                    if (sharedPreferences.contains(articleID)){
//                        System.out.println("remove bookmark");
                        editor.remove(articleID);
                        editor.commit();
                        mDataset.get(position - 1).marked = false;
                        mDataset.set(position - 1, new CardData(mDataset.get(position - 1)));
                        Toast.makeText(mContext, "\"" + mDataset.get(position - 1).title + "\" bookmark removed!",
                                Toast.LENGTH_SHORT).show();
                    }
                    else {
//                        System.out.println("add bookmark");
                        editor.putString(articleID, mDataset.get(position-1).toString());
                        editor.commit();
                        System.out.println(sharedPreferences.getString(articleID, null));
                        mDataset.get(position-1).marked = true;
                        mDataset.set(position - 1, new CardData(mDataset.get(position - 1)));
                        Toast.makeText(mContext, "\"" + mDataset.get(position - 1).title + "\" added to bookmark!",
                                Toast.LENGTH_SHORT).show();
                    }
                    adapter_this.notifyDataSetChanged();
                }
            });
            return homeViewHolder;
        }
    }

    // Replace the contents of a view (invoked by the layout manager)
    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        // - get element from your dataset at this position
        // - replace the contents of the view with that element
        if (position==0){
            WeatherViewHolder vh = (WeatherViewHolder) holder;

//            System.out.println("weather");
//            System.out.println(mWeather.weather);
            switch(mWeather.weather){
                case "Clouds" :
                    vh.imgView.setImageResource(R.drawable.cloudy_weather);
                    break;
                case "Clear" :
                    vh.imgView.setImageResource(R.drawable.clear_weather);
                    break;
                case "Snow" :
                    vh.imgView.setImageResource(R.drawable.snowy_weather);
                    break;
                case "Rain" :
                case "Drizzle":
                    vh.imgView.setImageResource(R.drawable.rainy_weather);
                    break;
                case "Thunderstorm" :
                    vh.imgView.setImageResource(R.drawable.thunder_weather);
                    break;
                case "Weather":
                    break;
                default :
                    vh.imgView.setImageResource(R.drawable.sunny_weather);
            }

            vh.cityTextView.setText(mWeather.city);
            vh.stateTextView.setText(mWeather.state);
            vh.tempTextView.setText(mWeather.temp);
            vh.weatherTextView.setText(mWeather.weather);
        }
        else{
//            System.out.println(position);
            HomeViewHolder vh = (HomeViewHolder) holder;
            String url = mDataset.get(position-1).imgUrl;
            Glide.with(mContext)
                    .load(url)
                    .into(vh.imgView);

            vh.titleTextView.setText(mDataset.get(position-1).title);
            try {
                vh.subView.setText(mDataset.get(position-1).getSub());
            } catch (ParseException e) {
                e.printStackTrace();
            }

            if (sharedPreferences.contains(mDataset.get(position-1).articleId)){
//                System.out.println("contain bookmark");
                vh.bookmarkView.setImageResource(R.drawable.ic_bookmark_24px);
                mDataset.get(position-1).marked = true;
            }
            else{
//                System.out.println("no bookmark");
                vh.bookmarkView.setImageResource(R.drawable.ic_bookmark_border_24px);
                mDataset.get(position-1).marked = false;
            }

        }
    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return mDataset.size() + 1;
    }

    @Override
    public int getItemViewType(int position){
        if (position==0){
            return 0;
        }
        return 1;
    }
}
