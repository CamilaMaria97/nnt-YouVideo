package com.hutchind.cordova.plugins.streamingmedia;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.content.ContentResolver;
import android.content.Intent;
import android.os.Build;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import java.util.Iterator;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

public class StreamingMedia extends CordovaPlugin {
	public static final String ACTION_PLAY_AUDIO = "playAudio";
	public static final String ACTION_PLAY_VIDEO = "playVideo";

	private static final int ACTIVITY_CODE_PLAY_MEDIA = 7;

	private CallbackContext callbackContext;

	private static final String TAG = "StreamingMediaPlugin";

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		this.callbackContext = callbackContext;
		JSONObject options = null;

		try {
			options = args.getJSONObject(1);
		} catch (JSONException e) {
			// Developer provided no options. Leave options null.
		}

		if (ACTION_PLAY_AUDIO.equals(action)) {
			return playAudio(args.getString(0), options);
		} else if (ACTION_PLAY_VIDEO.equals(action)) {
			return playVideo(args.getString(0), options);
		} else {
			callbackContext.error("streamingMedia." + action + " is not a supported method.");
			return false;
		}
	}

	private boolean playAudio(String url, JSONObject options) {
		return play(SimpleAudioStream.class, url, options);
	}
	private boolean playVideo(String url, JSONObject options) {
		if (options.has("vlc")) {
			return playv(url);
		}
		return play(SimpleVideoStream.class, url, options);
	}
    
    private boolean playv(final String url) {
		final CordovaInterface cordovaObj = cordova;
		final CordovaPlugin plugin = this;
            try{
                int vlcRequestCode = 42; //request code used when finished playing, not necessary if you only use startActivity(vlcIntent)
                 Intent vlcIntent = new Intent(Intent.ACTION_VIEW);
                 vlcIntent.setPackage("org.videolan.vlc");
                 vlcIntent.setDataAndTypeAndNormalize(Uri.parse(url), "video/*");
                 vlcIntent.putExtra("title", "ÑÑTV VLC");
                 try {
					 cordovaObj.startActivityForResult(plugin,vlcIntent, vlcRequestCode);
					 return true;
				 }catch (Exception e){
					 Intent gplay = new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=org.videolan.vlc"));
					 final Handler handler = new Handler(Looper.getMainLooper());
					 handler.postDelayed(new Runnable() {
						 @Override
						 public void run() {
							 //Do something after 100ms */
					 		 cordovaObj.startActivityForResult(plugin,gplay, vlcRequestCode);
						 }
					 }, 1000);
				 }
            }catch(Exception e){
				 Log.e(TAG, String.valueOf(e));
                return false;
            }
            return false;
	}

	private boolean play(final Class activityClass, final String url, final JSONObject options) {
		final CordovaInterface cordovaObj = cordova;
		final CordovaPlugin plugin = this;

		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {
				final Intent streamIntent = new Intent(cordovaObj.getActivity().getApplicationContext(), activityClass);
				Bundle extras = new Bundle();
				extras.putString("mediaUrl", url);

				if (options != null) {
					Iterator<String> optKeys = options.keys();
					while (optKeys.hasNext()) {
						try {
							final String optKey = (String)optKeys.next();
							if (options.get(optKey).getClass().equals(String.class)) {
								extras.putString(optKey, (String)options.get(optKey));
								Log.v(TAG, "Added option: " + optKey + " -> " + String.valueOf(options.get(optKey)));
							} else if (options.get(optKey).getClass().equals(Boolean.class)) {
								extras.putBoolean(optKey, (Boolean)options.get(optKey));
								Log.v(TAG, "Added option: " + optKey + " -> " + String.valueOf(options.get(optKey)));
							}

						} catch (JSONException e) {
							Log.e(TAG, "JSONException while trying to read options. Skipping option.");
						}
					}
					streamIntent.putExtras(extras);
				}

				cordovaObj.startActivityForResult(plugin, streamIntent, ACTIVITY_CODE_PLAY_MEDIA);
			}
		});
		return true;
	}

	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		Log.v(TAG, "onActivityResult: " + requestCode + " " + resultCode);
		super.onActivityResult(requestCode, resultCode, intent);
		if (requestCode == 42) {
			this.callbackContext.success();
		}
		if (ACTIVITY_CODE_PLAY_MEDIA == requestCode) {
			if (Activity.RESULT_OK == resultCode) {
				this.callbackContext.success();
			} else if (Activity.RESULT_CANCELED == resultCode) {
				String errMsg = "Error";
				if (intent != null && intent.hasExtra("message")) {
					errMsg = intent.getStringExtra("message");
				}
				this.callbackContext.error(errMsg);
			}
		}
	}
}