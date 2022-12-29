// 第三方投放平台
const otherPlatformList = [
  {
    label: "字节-巨量引擎",
    value: 1,
    url: "https://mapi.cqdingyan.com/invest_watch?AID=__AID__&AID_NAME=__AID_NAME__&ADVERTISER_ID=__ADVERTISER_ID__&CID=__CID__&CID_NAME=__CID_NAME__&CAMPAIGN_ID=__CAMPAIGN_ID__&CAMPAIGN_NAME=__CAMPAIGN_NAME__&CTYPE=__CTYPE__&CSITE=__CSITE__&CONVERT_ID=__CONVERT_ID__&REQUEST_ID=__REQUEST_ID__&SL=__SL__&MAC=__MAC__&MAC1=__MAC1__&IP=__IP__&UA=__UA__&GEO=__GEO__&TS=__TS__&CALLBACK_PARAM=__CALLBACK_PARAM__&CALLBACK_URL=__CALLBACK_URL__&MODEL=__MODEL__&UNION_SITE=__UNION_SITE__&IMEI=__IMEI__&ANDROIDID=__ANDROIDID__&OAID=__OAID__&OAID_MD5=__OAID_MD5__&OS=__OS__&IDFA=__IDFA__",
  },
  {
    label: "百度-SEM",
    value: 4,
    url: "https://mapi.cqdingyan.com/invest_watch?AID={{PLAN_ID}}&ADVERTISER_ID={{USER_ID}}&CID={{IDEA_ID}}&CAMPAIGN_ID={{UNIT_ID}}&REQUEST_ID={{CLICK_ID}}&MAC={{MAC}}&MAC1={{MAC_MD5}}&IP={{IP}}&UA={{UA}}&TS={{TS}}&CALLBACK_URL={{CALLBACK_URL}}&IMEI={{IMEI_MD5}}&IDFA={{IDFA}}&ANDROIDID={{ANDROID_ID_MD5}}&OAID={{OAID}}&OS={{OS}}",
  },
  {
    label: "快手-磁力引擎",
    value: 5,
    url: "https://mapi.cqdingyan.com/invest_watch?AID=__DID__&AID_NAME=__DNAME__&ADVERTISER_ID=__ACCOUNTID__&CID=__CID__&CAMPAIGN_ID=__AID__&CSITE=__CSITE__&MAC=__MAC2__&MAC1=__MAC3__&IP=__IP__&UA=__UA__&TS=__TS__&CALLBACK_URL=__CALLBACK__&IMEI=__IMEI2__&IDFA=__IDFA2__&ANDROIDID=__ANDROIDID2__&OAID=__OAID__&OS=__OS__&KS_IMEI3=__IMEI3__&KS_ANDROIDID3=__ANDROIDID3__&KS_IDFA3=__IDFA3__&MODEL=__MODEL__&OAID_MD5=__OAID2__",
  },
  {
    label: "腾讯广告",
    value: 2,
    url: "https://mapi.cqdingyan.com/invest_watch?ADVERTISER_ID=__ACCOUNT_ID__&CAMPAIGN_ID=__ADGROUP_ID__&AID=__AD_ID__&IMEI=__MUID__&IDFA=__MUID__&REQUEST_ID=__CLICK_ID__&IP=__IP__&UA=__USER_AGENT__&TS=__CLICK_TIME__&AID_NAME=__CAMPAIGN_NAME__&CID_NAME=__AD_NAME__&CALLBACK_URL=__CALLBACK__&MODEL=__MODEL__&ANDROIDID=__HASH_ANDROID_ID__&OAID=__OAID__&OAID_MD5=__HASH_OAID__&P_CAMPAIGN_ID=__CAMPAIGN_ID__&ad_platform_type=__AD_PLATFORM_TYPE__&ad_type=__AD_TYPE__&agency_id=__AGENCY_ID__&click_sku_id=__CLICK_SKU_ID__&billing_event=__BILLING_EVENT__&deeplink_url=__DEEPLINK_URL__&page_url=__PAGE_URL__&device_os_type=__DEVICE_OS_TYPE__&process_time=__PROCESS_TIME__&promoted_object_id=__PROMOTED_OBJECT_ID__&promoted_object_type=__PROMOTED_OBJECT_TYPE__&real_cost=__REAL_COST__&request_id=__REQUEST_ID__&impression_id=__IMPRESSION_ID__&site_set=__SITE_SET__&muid=__MUID__&encrypted_position_id=__ENCRYPTED_POSITION_ID__&ipv6=__IPV6__&site_set_name=__SITE_SET_NAME__",
  },
  {
    label: "微信广告",
    value: 19,
    url: "https://mapi.cqdingyan.com/invest_watch?"
  },
  {
    label: "星图-传播任务（KOL）",
    value: 8,
    url: "https://mapi.cqdingyan.com/invest_watch?AID=__ORDER_ID__&CAMPAIGN_ID=__DEMAND_ID__&CID=__ITEM_ID__&IP=__IP__&UA=__UA__&MODEL=__MODEL__&TS=__TS__&CAMPAIGN_ID=__DEMAND_ID__&CALLBACK_URL=__CALLBACK_URL__&CALLBACK_PARAM=__CALLBACK_PARAM__&OS=__OS__",
  },
  {
    label: "星图-投稿播放CPM（KOL）",
    value: 14,
    url: "https://mapi.cqdingyan.com/invest_watch?AID=__ORDER_ID__&CAMPAIGN_ID=__DEMAND_ID__&CID=__ITEM_ID__&IP=__IP__&UA=__UA__&MODEL=__MODEL__&TS=__TS__&CAMPAIGN_ID=__DEMAND_ID__&CALLBACK_URL=__CALLBACK_URL__&CALLBACK_PARAM=__CALLBACK_PARAM__&OS=__OS__",
  },
  {
    label: "星图-投稿安装CPI（KOL）",
    value: 11,
    url: "https://mapi.cqdingyan.com/invest_watch?AID=__ORDER_ID__&CAMPAIGN_ID=__DEMAND_ID__&CID=__ITEM_ID__&MAC=__MAC__&MAC1=__MAC1__&IP=__IP__&UA=__UA__&GEO=__GEO__&CALLBACK_PARAM=__CALLBACK_PARAM__&CALLBACK_URL=__CALLBACK_URL__&MODEL=__MODEL__&IMEI=__IMEI__&IDFA=__IDFA__&ANDROIDID=__ANDROIDID__&OAID=__OAID__&OAID_MD5=__OAID_MD5__&OS=__OS__&TS=__TS__",
  },
  {
    label: "星图-投稿激活CPA（KOL）",
    value: 17,
    url: "https://mapi.cqdingyan.com/invest_watch?AID=__ORDER_ID__&CAMPAIGN_ID=__DEMAND_ID__&CID=__ITEM_ID__&MAC=__MAC__&MAC1=__MAC1__&IP=__IP__&UA=__UA__&GEO=__GEO__&CALLBACK_PARAM=__CALLBACK_PARAM__&CALLBACK_URL=__CALLBACK_URL__&MODEL=__MODEL__&IMEI=__IMEI__&IDFA=__IDFA__&ANDROIDID=__ANDROIDID__&OAID=__OAID__&OAID_MD5=__OAID_MD5__&OS=__OS__&TS=__TS__",
  },
  {
    label: "快手-磁力聚星（KOL）",
    value: 9,
    url: "https://mapi.cqdingyan.com/invest_watch?MAC=__MAC3__&IP=__IP__&TS=__TS__&CALLBACK_URL=__CALLBACK__&IMEI=__IMEI2__&IDFA=__IDFA2__&ANDROIDID=__ANDROIDID2__&OAID=__OAID__&OS=__OS__&MISSION_ID=__MISSION_ID__&ORDER_ID=__ORDER_ID__&DID=__DID__",
  },
  {
    label: "B站",
    value: 6,
    url: "https://mapi.cqdingyan.com/invest_watch?AID=__CAMPAIGNID__&ADVERTISER_ID=__ACCOUNTID__&CID=__CREATIVEID__&CAMPAIGN_ID=__AID__&MAC=__MAC1__&IP=__IP__&UA=__UA__&TS=__TS__&CALLBACK_URL=__CALLBACKURL__&IMEI=__IMEI__&IDFA=__IDFA__&ANDROIDID=__ANDROIDID__&OAID=__OAID__&OS=__OS__&BZ_TRACKID=__TRACKID__&BZ_UNITID=__UNITID__&CAID1=__CAID__&BZ_AAID=__AAID__&MODEL=__MODEL__&BZ_SHOPID=__SHOPID__&BZ_UPMID=__UPMID__",
  },
  {
    label: "椰子传媒",
    value: 7,
    url: "https://mapi.cqdingyan.com/invest_watch?IP={ip}&TS={UNIXMILLI}&IMEI={imeimd5}&OAID={oaid}&CALLBACK_URL={callback}",
  },
  {
    label: "xmob",
    value: 12,
    url: "https://mapi.cqdingyan.com/invest_watch?IP={ip}&UA={ua}&MAC={mac}&MAC1={mac_md5}&IMEI={imei_md5}&ANDROIDID={android_md5}&OAID={oaid}&CALLBACK_URL={callback}&MODCID={mob_cid}&CAID={caid}&IDFA={idfa}&AID={plan_id}",
  },
  {
    label: "落地页",
    value: '0',
  },
  {
    label: "华为",
    value: 13,
    url: "https://mapi.cqdingyan.com/invest_watch?AID=__AID__&AID_NAME=__AID_NAME__&CID_NAME=__GROUP_NAME__&CAMPAIGN_ID=__RTAID__&TS=__TS__&ACTION_TYPE=__ACTION_TYPE__&CALLBACK_URL=__CALLBACK__&OAID=__OAID__&CID=__GROUP_ID__",
  },
  {
    label: "搜狗SEM",
    value: 16,
    url: "https://mapi.cqdingyan.com/invest_watch?ACCOUNT_ID={{ACCOUNT_ID}}&PLAN_ID={{PLAN_ID}}&GROUP_ID={{GROUP_ID}}&CREATIVE_ID={{CREATIVE_ID}}&CALLBACK_URL={{CALLBACK_URL}}&SG_VID={{SG_VID}}&CLICK_ID={{CLICK_ID}}&IMEI_MD5={{IMEI_MD5}}&ANDROID_ID_MD5={{ANDROID_ID_MD5}}&OAID={{OAID}}&IDFA={{IDFA}}&IP={{IP}}&UA={{UA}}&OS={{OS}}&TS={{TS}}&SIGN=--",
  },
  {
    label: "小红书落地页",
    value: 18,
  },
  {
    label: "其他",
    value: 15,
    url: "",
  },
];

const getConnectUrl = (data) => {
  const { appid, origin, system_create, system, system2, appid2 } = data;
  let params;
  if (system_create != "19"&&Number(appid2)>0 && Number(system2)>0) {
    params = `&nt_appid=${appid}&nt_platform=${system_create}&nt_channel=${origin}&nt_os=${system}&nt2_os=${system2}&nt2_appid=${appid2}`;
  }else if(system_create == "19" && Number(appid2)>0 && Number(system2)>0){
    params = `nt_appid=${appid}&nt_platform=${system_create}&nt_channel=${origin}&nt_os=${system}&nt2_os=${system2}&nt2_appid=${appid2}`;
  }else if(system_create == "19" && Number(appid2) == 0 && Number(system2) == 0){
    params = `nt_appid=${appid}&nt_platform=${system_create}&nt_channel=${origin}&nt_os=${system}`;
  } else if(system_create != "19"&&Number(appid2)==0 && Number(system2)==0) {
    params = `&nt_appid=${appid}&nt_platform=${system_create}&nt_channel=${origin}&nt_os=${system}`;
  }

  // 判断参数是否存在，保证不会返回undefined
  if(!appid || !origin || !system || !system_create){
    return false
  }

  const currentPlatform = otherPlatformList.find(
    (v) => v.value == system_create
  );

  if (currentPlatform) {
    return currentPlatform.url + params;
  }

  return `https://mapi.cqdingyan.com/invest_watch?AID=__AID__&AID_NAME=__AID_NAME__&ADVERTISER_ID=__ADVERTISER_ID__&CID=__CID__&CID_NAME=__CID_NAME__&CAMPAIGN_ID=__CAMPAIGN_ID__&CAMPAIGN_NAME=__CAMPAIGN_NAME__&CTYPE=__CTYPE__&CSITE=__CSITE__&CONVERT_ID=__CONVERT_ID__&REQUEST_ID=__REQUEST_ID__&SL=__SL__&MAC=__MAC__&MAC1=__MAC1__&IP=__IP__&UA=__UA__&GEO=__GEO__&TS=__TS__&CALLBACK_PARAM=__CALLBACK_PARAM__&CALLBACK_URL=__CALLBACK_URL__&MODEL=__MODEL__&UNION_SITE=__UNION_SITE__&IMEI=__IMEI__&ANDROIDID=__ANDROIDID__&OAID=__OAID__&OAID_MD5=__OAID_MD5__&OS=__OS__&IDFA=__IDFA__${params}`;
};

const getCurrentPlatform = (id) => {
  const currentPlatform = otherPlatformList.find((v) => v.value == id);

  return currentPlatform || {};
};

export { otherPlatformList, getConnectUrl, getCurrentPlatform };
