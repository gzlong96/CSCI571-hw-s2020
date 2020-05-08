package com.example.hw9.ui.section;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.hw9.DetailActivity;
import com.example.hw9.ui.CardData;
import com.example.hw9.R;

import java.text.ParseException;
import java.util.List;

public class SectionTabAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder>{
    private List<CardData> mDataset;
    public Context mContext;
    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;
    private SectionTabAdapter adapter_this;

    public static class SectionTabViewHolder extends RecyclerView.ViewHolder {
        // each data item is just a string in this case
        public TextView titleTextView;
        public ImageView imgView;
        public CardView cardView;
        public ImageView bookmarkView;
        public TextView subView;

        public SectionTabViewHolder(View v) {
            super(v);
            titleTextView = v.findViewById(R.id.card_text);
            imgView = v.findViewById(R.id.card_img);
            cardView = v.findViewById(R.id.card_view);
            bookmarkView = v.findViewById(R.id.card_bookmark);
            subView = v.findViewById(R.id.card_sub);
        }
    }

    // Provide a suitable constructor (depends on the kind of dataset)
    @SuppressLint("CommitPrefEdits")
    public SectionTabAdapter(Context context, List<CardData> myDataset) {
        mDataset = myDataset;
        mContext = context;
        sharedPreferences = mContext.getSharedPreferences("bookmark", 0);
        editor = sharedPreferences.edit();
        adapter_this = this;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.card_view, parent, false);

        SectionTabAdapter.SectionTabViewHolder sectionTabViewHolder = new SectionTabAdapter.SectionTabViewHolder(v);
        sectionTabViewHolder.cardView.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                int position = sectionTabViewHolder.getAdapterPosition();
                String articleID = mDataset.get(position).articleId;
                String articleTitle = mDataset.get(position).title;
                Intent intent = new Intent(mContext, DetailActivity.class);
                intent.putExtra("title", articleTitle);
                intent.putExtra("id", articleID);
                mContext.startActivity(intent);
            }
        });

        sectionTabViewHolder.cardView.setOnLongClickListener(new View.OnLongClickListener(){
            @Override
            public boolean onLongClick(View v) {
                int position = sectionTabViewHolder.getAdapterPosition();
                final Dialog dialog = new Dialog(mContext);
                // Include dialog.xml file
                dialog.setContentView(R.layout.share_dialog);
                // Set dialog title
//                    dialog.setTitle("Custom Dialog");

                // set values for custom dialog components - text, image and button
                TextView dialog_title = dialog.findViewById(R.id.dialog_title);
                dialog_title.setText(mDataset.get(position).title);
                ImageView image = dialog.findViewById(R.id.dialog_img);
                Glide.with(mContext)
                        .load(mDataset.get(position).imgUrl)
                        .into(image);

                ImageView twitter = dialog.findViewById(R.id.dialog_twitter);

                twitter.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        // Close dialog
//                            dialog.dismiss();
                        Uri uri = Uri.parse("https://twitter.com/intent/tweet?text=Check out this link:\n&url="+
                                mDataset.get(position).articleUrl + "&hashtags=CSCI571NewsSearch");
                        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                        mContext.startActivity(intent);
                        System.out.println("twitter clicked");
                    }
                });

                ImageView bookmark = dialog.findViewById(R.id.dialog_bookmark);
                String articleID = mDataset.get(position).articleId;
                if (sharedPreferences.contains(articleID)){
                    bookmark.setImageResource(R.drawable.ic_bookmark_24px);
                }

                bookmark.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        int position = sectionTabViewHolder.getAdapterPosition();
//                    System.out.println(position);
                        String articleID = mDataset.get(position).articleId;
                        if (sharedPreferences.contains(articleID)){
//                        System.out.println("remove bookmark");
                            editor.remove(articleID);
                            editor.commit();
                            mDataset.get(position).marked = false;
                            mDataset.set(position, new CardData(mDataset.get(position)));
                            bookmark.setImageResource(R.drawable.ic_bookmark_border_24px);
                            Toast.makeText(mContext, "\"" + mDataset.get(position).title + "\" bookmark removed!",
                                    Toast.LENGTH_SHORT).show();
                        }
                        else {
//                        System.out.println("add bookmark");
                            editor.putString(articleID, mDataset.get(position).toString());
                            editor.commit();
                            System.out.println(sharedPreferences.getString(articleID, null));
                            mDataset.get(position).marked = true;
                            mDataset.set(position, new CardData(mDataset.get(position)));
                            bookmark.setImageResource(R.drawable.ic_bookmark_24px);
                            Toast.makeText(mContext, "\"" + mDataset.get(position).title + "\" added to bookmark!",
                                    Toast.LENGTH_SHORT).show();
                        }
                        adapter_this.notifyDataSetChanged();
                    }
                });

                dialog.show();
                return true;
            }
        });

        sectionTabViewHolder.bookmarkView.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                int position = sectionTabViewHolder.getAdapterPosition();
//                    System.out.println(position);
                String articleID = mDataset.get(position).articleId;
                if (sharedPreferences.contains(articleID)){
//                        System.out.println("remove bookmark");
                    editor.remove(articleID);
                    editor.commit();
                    mDataset.get(position).marked = false;
                    mDataset.set(position, new CardData(mDataset.get(position)));
                    Toast.makeText(mContext, "\"" + mDataset.get(position).title + "\" bookmark removed!",
                            Toast.LENGTH_SHORT).show();
                }
                else {
//                        System.out.println("add bookmark");
                    editor.putString(articleID, mDataset.get(position).toString());
                    editor.commit();
//                    System.out.println(sharedPreferences.getString(articleID, null));
                    mDataset.get(position).marked = true;
                    mDataset.set(position, new CardData(mDataset.get(position)));
                    Toast.makeText(mContext, "\"" + mDataset.get(position).title + "\" added to bookmark!",
                            Toast.LENGTH_SHORT).show();
                }
                adapter_this.notifyDataSetChanged();
            }
        });

        return sectionTabViewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        SectionTabViewHolder vh = (SectionTabViewHolder) holder;
        String url = mDataset.get(position).imgUrl;
        Glide.with(mContext)
                .load(url)
                .into(vh.imgView);

        vh.titleTextView.setText(mDataset.get(position).title);
        try {
            vh.subView.setText(mDataset.get(position).getSub());
        } catch (ParseException e) {
            e.printStackTrace();
        }

        if (sharedPreferences.contains(mDataset.get(position).articleId)){
//                System.out.println("contain bookmark");
            vh.bookmarkView.setImageResource(R.drawable.ic_bookmark_24px);
            mDataset.get(position).marked = true;
        }
        else{
//                System.out.println("no bookmark");
            vh.bookmarkView.setImageResource(R.drawable.ic_bookmark_border_24px);
            mDataset.get(position).marked = false;
        }
    }

    @Override
    public int getItemCount() {
        return mDataset.size();
    }
}
