package projekt.zespolowy.dziura;

import android.content.pm.ActivityInfo;
import android.view.View;
import android.widget.TabHost.OnTabChangeListener;

/**
 * Listener obslugujacy zmiane zakladek. Implementuje interfejs {@link android.widget.TabHost.OnTabChangeListener}.
 * Po zmianie zakladki, wywolana zostaje funkcja {@link projekt.zespolowy.dziura.MyOnTabChangedListener#onTabChanged(String arg0)}.
 *
 */
public class MyOnTabChangedListener implements OnTabChangeListener
{
	private DziuraActivity mContext;

	/**
	 * Konstruktor klasy {@link MyOnTabChangedListener}.
	 * @param dziuraActivity instancja aktywnosci, ktorej ma dotyczyc obsluga zmiany zakladek
	 */
	public MyOnTabChangedListener(DziuraActivity dziuraActivity) 
	{
		this.mContext = dziuraActivity;
	}

	/**
	 * Funkcja wywolywana po zmianie aktywnej zakladki. W zaleznosci od wybranej zakladki przelacza widok i zmienia orientacje ekranu aplikacji.
	 * 
	 * @param arg0 identyfikator wybranej zakladki
	 */
	/* (non-Javadoc)
	 * @see android.widget.TabHost.OnTabChangeListener#onTabChanged(java.lang.String)
	 */
	public void onTabChanged(String arg0)
	{
		if(arg0.equals("fotoTab"))
		{
			mContext.vCamera.resume();
			mContext.vOption.mOptionsView.setVisibility(View.GONE);
			mContext.vCamera.mCameraView.setVisibility(View.VISIBLE);
			if(mContext.appMenu != null)
			{
				mContext.appMenu.getMenu().setGroupVisible(1, false);
				mContext.appMenu.getMenu().setGroupVisible(0, true);
			}
			mContext.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
		}
		else if(arg0.equals("formTab"))
		{
			mContext.vCamera.mCameraView.setVisibility(View.GONE);
			mContext.vOption.mOptionsView.setVisibility(View.VISIBLE);
			if(mContext.appMenu != null)
			{
				mContext.appMenu.getMenu().setGroupVisible(0, false);
				if(mContext.vOption.cGPS.isChecked()!=true)
				{
					mContext.appMenu.getMenu().setGroupVisible(1, true);
				}
				else
				{
					mContext.appMenu.getMenu().setGroupVisible(1, false);
				}
			}
			mContext.vOption.cGPS.requestFocus();
			if(mContext.vOption.cGPS.isChecked() == false)
			{
				boolean isInternetEnabled = mContext.isInternetEnabled();
				if (!(isInternetEnabled)) 
				{
					mContext.vOption.wifiMap = true;
					mContext.showWirelessOptions("Aby korzysta� z mapy, nale�y po��czy� si� z Internetem."+
							" Czy chcesz si� po��czy�?", "Uwaga");
				}
			}
			mContext.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
		}
	}

}