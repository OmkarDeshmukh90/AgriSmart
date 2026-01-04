
export const translations: Record<string, any> = {
  en: {
    app_name: "AgriSmart",
    welcome: "Welcome aboard!",
    season_started: "Season Started",
    nav: { home: "Home", scan: "Scan", plan: "Plan", market: "Market", social: "Social" },
    login: {
      title: "What's your mobile number?",
      subtitle: "We'll send you an OTP to verify your account and keep your farm data secure.",
      placeholder: "00000 00000",
      terms: "By continuing, you agree to our Terms of Service and Privacy Policy.",
      btn: "Send OTP"
    },
    otp: {
      title: "Enter the 4-digit code",
      subtitle: "Sent to",
      resend: "Resend Code",
      resend_in: "Resend code in",
      btn: "Verify & Start"
    },
    dashboard: {
      ready: "Ready to start your season?",
      ready_desc: "Get personalized advice, weather alerts, and yield tracking for your specific crop.",
      choose_crop: "Choose Your Crop",
      trending: "Trending Prices",
      view_all: "View All",
      priority_task: "Priority Task",
      urgent: "Urgent",
      mark_done: "Mark as Done",
      task_completed: "Task Completed",
      weather_alert: "Weather Alert",
      high_impact: "High Impact"
    },
    weather: {
      title: "Weather & Alerts",
      forecast_7_days: "7-Day Forecast",
      advisory_title: "Weather Advisory",
      action_required: "Action Recommended",
      humidity: "Humidity",
      wind_speed: "Wind Speed",
      precip: "Rain Chance",
      advisory_text: "Continuous heavy rain expected for the next 2 days. Soil saturation levels may exceed crop tolerance.",
      advisory_action: "Check Drainage System",
      today: "Today",
      details: "Current Conditions"
    },
    scanner: {
      title: "Crop Health Scanner",
      subtitle: "Scan leaves or stems to detect diseases early.",
      take_photo: "Take a Photo",
      analyzing: "Analyzing Crop...",
      diagnosis: "Diagnosis",
      confidence: "Confidence",
      treatment: "Recommended Treatment",
      steps: "Steps to follow",
      scan_new: "Scan New Plant",
      error: "Error analyzing image."
    },
    market: {
      title: "Market Insights",
      tracking: "Tracking prices at",
      tabs: { trends: "Price Trends", advisor: "Sell Advisor" },
      price: "Price",
      connect_btn: "Connect to Buyer",
      connecting: "Connecting...",
      request_sent: "Request Sent",
      request_msg: "Buy request sent to 5 verified traders.",
      commodities: "Nearest Mandi Prices",
      advisor_title: "HarvestHub Advisor",
      advisor_subtitle: "AI-Powered Profit Maximization",
      target_rate: "Target Rate",
      profitability: "Profitability",
      sentiment_title: "Market Sentiment",
      sentiment_desc: "80% Bullish - Traders are looking for volume",
      recommendation: { sell: "SELL NOW", wait: "WAIT" }
    },
    irrigation: {
      title: "Irrigation",
      subtitle: "Precision water management.",
      savings: "Monthly Savings",
      field_status: "Field Status",
      soil: "Soil",
      next: "Next",
      ai_rec: "AI Recommendation",
      apply_adj: "Apply Adjustment",
      zones: {
        north: "North Field",
        east: "East Orchard",
        greenhouse: "Greenhouse"
      },
      rec_msg: "Incoming storm detected. Delay Zone 1 & 2 by 12 hours to maximize water efficiency."
    },
    community: {
      title: "Agri Hub",
      subtitle: "Expert Advice & Farmer Community",
      search_placeholder: "Search for advice or questions...",
      filters: { all: "All", advisory: "Advisories", questions: "Questions" },
      no_posts: "No posts found.",
      ask_btn: "Ask Question",
      modal: {
        title: "Post to Agri Hub",
        subtitle: "Share with local farmers",
        label_msg: "Your Message",
        label_cat: "Category",
        btn_publish: "Publish Post",
        placeholder: "Ask a question or share a tip..."
      }
    },
    plan: {
      no_plan_title: "No Active Crop Plan",
      no_plan_desc: "Select a crop from the Home screen to generate a customized seasonal plan.",
      tabs: { overview: "Overview", calendar: "Calendar", tasks: "Tasks" },
      complete: "Complete",
      elapsed: "Elapsed",
      remaining: "Remaining",
      days: "Days",
      growth_stage: "Growth Stage",
      pending_tasks: "Pending Tasks Today",
      roadmap: "Roadmap Timeline",
      today: "Today",
      history: "History",
      quantity: "Quantity",
      mark_done: "Mark as Done",
      remind_later: "Remind Later",
      stages: {
        sowing: "Sowing",
        growth: "Growth",
        flowering: "Flowering",
        harvest: "Harvest"
      }
    },
    recommendation: {
      title: "Crop Recommendation",
      insight: "Based on your soil type and current moisture levels in Hinjewadi, these 3 crops offer the best balance of yield and profit.",
      tabs: { list: "Top Picks", compare: "Detailed Comparison" },
      profit: "Expected Profit",
      risk: "Risk",
      compare_btn: "Compare Details",
      select_btn: "Select Crop",
      back_btn: "Back to Summary",
      table: { crop: "Crop", profit: "Profit", yield: "Yield", cost: "Cost", price: "Price" },
      expert: "Expert Advice",
      confirmation: {
        title: "Confirm Selection",
        subtitle: "Review your choice before starting.",
        start_plan: "Start Crop Plan",
        risk_warning: "Risk Analysis",
        duration_notice: "Season Duration",
        cancel: "Cancel"
      }
    },
    setup: {
      step1: { title: "Let's get started", subtitle: "Tell us a bit about yourself to personalize your experience.", name: "Full Name", village: "Your Village" },
      step2: { title: "Land Details", subtitle: "Tell us about your farm resources.", size: "Land Size", source: "Source of Water", type: "Irrigation Type" },
      step3: { title: "Soil Health", subtitle: "Enter soil test values or upload a Health Card.", upload_btn: "Upload Soil Health Card", or: "OR Enter Manually", n: "Nitrogen (N)", p: "Phosphorus (P)", k: "Potassium (K)", ph: "pH Level", default_msg: "Leave empty to use regional averages." },
      step4: { title: "Confirm Location", subtitle: "Pinpoint your farm for hyper-local weather alerts.", label: "Farm Location", warning: "Ensure you are currently at your farm for the most accurate sensor integration." },
      btn_continue: "Continue",
      btn_finish: "Finish Setup"
    },
    settings: {
      title: "Profile & Settings",
      app_section: "Application",
      lang: "Language",
      notifications: "Push Notifications",
      data_sync: "Data Sync",
      support_section: "Support",
      sign_out: "Sign Out"
    },
    offline: {
      title: "No Internet",
      quote: "Agriculture is our wisest pursuit, online or offline.",
      active: "Offline mode active",
      desc: "Your tasks & seasonal plans are still available for local viewing.",
      retry: "Retry Connection"
    }
  },
  hi: {
    app_name: "एग्रीस्मार्ट",
    welcome: "स्वागत है!",
    season_started: "सीजन शुरू हुआ",
    nav: { home: "होम", scan: "स्कैन", plan: "योजना", market: "मंडी", social: "समुदाय" },
    login: {
      title: "आपका मोबाइल नंबर क्या है?",
      subtitle: "हम आपके खाते को सत्यापित करने और आपके कृषि डेटा को सुरक्षित रखने के लिए एक OTP भेजेंगे।",
      placeholder: "00000 00000",
      terms: "जारी रखकर, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत हैं।",
      btn: "OTP भेजें"
    },
    otp: {
      title: "4-अंकीय कोड दर्ज करें",
      subtitle: "भेजा गया",
      resend: "कोड पुनः भेजें",
      resend_in: "कोड पुनः भेजें",
      btn: "सत्यापित करें और शुरू करें"
    },
    dashboard: {
      ready: "क्या आप सीजन शुरू करने के लिए तैयार हैं?",
      ready_desc: "अपनी विशिष्ट फसल के लिए व्यक्तिगत सलाह, मौसम अलर्ट और उपज ट्रैकिंग प्राप्त करें।",
      choose_crop: "फसल चुनें",
      trending: "मंडी भाव",
      view_all: "सभी देखें",
      priority_task: "महत्वपूर्ण कार्य",
      urgent: "अत्यावश्यक",
      mark_done: "पूर्ण चिह्नित करें",
      task_completed: "कार्य पूर्ण",
      weather_alert: "मौसम चेतावनी",
      high_impact: "उच्च प्रभाव"
    },
    weather: {
      title: "मौसम और अलर्ट",
      forecast_7_days: "7-दिवसीय पूर्वानुमान",
      advisory_title: "मौसम सलाह",
      action_required: "अनुशंसित कार्रवाई",
      humidity: "नमी",
      wind_speed: "हवा की गति",
      precip: "वर्षा की संभावना",
      advisory_text: "अगले 2 दिनों तक लगातार भारी बारिश की उम्मीद है। मिट्टी की संतृप्ति स्तर फसल सहिष्णुता से अधिक हो सकता है।",
      advisory_action: "जल निकासी प्रणाली की जाँच करें",
      today: "आज",
      details: "वर्तमान स्थितियां"
    },
    scanner: {
      title: "फसल स्वास्थ्य स्कैनर",
      subtitle: "बीमारियों का जल्दी पता लगाने के लिए पत्तियों या तनों को स्कैन करें।",
      take_photo: "फोटो लें",
      analyzing: "फसल का विश्लेषण...",
      diagnosis: "निदान",
      confidence: "आत्मविश्वास",
      treatment: "अनुशंसित उपचार",
      steps: "पालन करने के चरण",
      scan_new: "नया पौधा स्कैन करें",
      error: "छवि विश्लेषण में त्रुटि।"
    },
    market: {
      title: "मंडी जानकारी",
      tracking: "मूल्य ट्रैकिंग स्थान",
      tabs: { trends: "मूल्य रुझान", advisor: "बिक्री सलाहकार" },
      price: "मूल्य",
      connect_btn: "खरीदार से जुड़ें",
      connecting: "कनेक्ट हो रहा है...",
      request_sent: "अनुरोध भेजा गया",
      request_msg: "5 सत्यापित व्यापारियों को खरीद अनुरोध भेजा गया।",
      commodities: "निकटतम मंडी भाव",
      advisor_title: "हार्वेस्टहब सलाहकार",
      advisor_subtitle: "AI-संचालित लाभ अधिकतमीकरण",
      target_rate: "लक्ष्य दर",
      profitability: "लाभप्रदता",
      sentiment_title: "बाजार की भावना",
      sentiment_desc: "80% तेजी - व्यापारी वॉल्यूम की तलाश में हैं",
      recommendation: { sell: "अभी बेचें", wait: "प्रतीक्षा करें" }
    },
    irrigation: {
      title: "सिंचाई",
      subtitle: "सटीक जल प्रबंधन।",
      savings: "मासिक बचत",
      field_status: "खेत की स्थिति",
      soil: "मिट्टी",
      next: "अगला",
      ai_rec: "AI सिफारिश",
      apply_adj: "समायोजन लागू करें",
      zones: {
        north: "उत्तरी खेत",
        east: "पूर्वी बाग",
        greenhouse: "ग्रीनहाउस"
      },
      rec_msg: "आने वाले तूफान का पता चला। जल दक्षता को अधिकतम करने के लिए ज़ोन 1 और 2 को 12 घंटे देरी करें।"
    },
    community: {
      title: "कृषि हब",
      subtitle: "विशेषज्ञ सलाह और किसान समुदाय",
      search_placeholder: "सलाह या प्रश्न खोजें...",
      filters: { all: "सभी", advisory: "सलाह", questions: "प्रश्न" },
      no_posts: "कोई पोस्ट नहीं मिली।",
      ask_btn: "प्रश्न पूछें",
      modal: {
        title: "कृषि हब पर पोस्ट करें",
        subtitle: "स्थानीय किसानों के साथ साझा करें",
        label_msg: "आपका संदेश",
        label_cat: "श्रेणी",
        btn_publish: "पोस्ट प्रकाशित करें",
        placeholder: "एक प्रश्न पूछें या एक सुझाव साझा करें..."
      }
    },
    plan: {
      no_plan_title: "कोई सक्रिय फसल योजना नहीं",
      no_plan_desc: "अनुकूलित मौसमी योजना बनाने के लिए होम स्क्रीन से एक फसल चुनें।",
      tabs: { overview: "अवलोकन", calendar: "कैलेंडर", tasks: "कार्य" },
      complete: "पूर्ण",
      elapsed: "बीता हुआ",
      remaining: "शेष",
      days: "दिन",
      growth_stage: "विकास चरण",
      pending_tasks: "आज के लंबित कार्य",
      roadmap: "रोडमैप समयरेखा",
      today: "आज",
      history: "इतिहास",
      quantity: "मात्रा",
      mark_done: "पूर्ण चिह्नित करें",
      remind_later: "नंतर आठवण करा",
      stages: {
        sowing: "बुवाई",
        growth: "विकास",
        flowering: "पुष्पन",
        harvest: "कटाई"
      }
    },
    recommendation: {
      title: "फसल सिफारिश",
      insight: "हिंजवडी में आपकी मिट्टी के प्रकार और वर्तमान नमी के स्तर के आधार पर, ये 3 फसलें उपज और लाभ का सबसे अच्छा संतुलन प्रदान करती हैं।",
      tabs: { list: "शीर्ष चयन", compare: "विस्तृत तुलना" },
      profit: "अपेक्षित लाभ",
      risk: "जोखिम",
      compare_btn: "विवरण तुलना",
      select_btn: "फसल चुनें",
      back_btn: "सारांश पर वापस जाएं",
      table: { crop: "फसल", profit: "लाभ", yield: "उपज", cost: "लागत", price: "मूल्य" },
      expert: "विशेषज्ञ सलाह",
      confirmation: {
        title: "चयन की पुष्टि करें",
        subtitle: "शुरू करने से पहले अपनी पसंद की समीक्षा करें।",
        start_plan: "फसल योजना शुरू करें",
        risk_warning: "जोखिम विश्लेषण",
        duration_notice: "सीजन अवधि",
        cancel: "रद्द करें"
      }
    },
    setup: {
      step1: { title: "चलिए शुरू करते हैं", subtitle: "अपने अनुभव को व्यक्तिगत बनाने के लिए हमें अपने बारे में थोड़ा बताएं।", name: "पूरा नाम", village: "तुमचे गाव" },
      step2: { title: "भूमि विवरण", subtitle: "हमें अपने खेत संसाधनों के बारे में बताएं।", size: "भूमि का आकार", source: "जल स्रोत", type: "सिंचाई प्रकार" },
      step3: { title: "मृदा स्वास्थ्य", subtitle: "मिट्टी परीक्षण मान दर्ज करें या स्वास्थ्य कार्ड अपलोड करें।", upload_btn: "मृदा स्वास्थ्य कार्ड अपलोड करें", or: "या मैन्युअल रूप से दर्ज करें", n: "नाइट्रोजन (N)", p: "फॉस्फोरस (P)", k: "पोटेशियम (K)", ph: "pH स्तर", default_msg: "क्षेत्रीय औसत का उपयोग करने के लिए खाली छोड़ दें।" },
      step4: { title: "स्थान की पुष्टि करें", subtitle: "हाइपर-लोकल मौसम अलर्ट के लिए अपने खेत को पिनपॉइंट करें।", label: "खेत का स्थान", warning: "सुनिश्चित करें कि आप सबसे सटीक सेंसर एकीकरण के लिए वर्तमान में अपने खेत पर हैं।" },
      btn_continue: "जारी रखें",
      btn_finish: "सेटअप समाप्त करें"
    },
    settings: {
      title: "प्रोफ़ाइल और सेटिंग्स",
      app_section: "अनुप्रयोग",
      lang: "भाषा",
      notifications: "पुश सूचनाएं",
      data_sync: "डेटा सिंक",
      support_section: "सहायता",
      sign_out: "साइन आउट"
    },
    offline: {
      title: "इंटरनेट नहीं है",
      quote: "कृषि हमारा सबसे बुद्धिमान प्रयास है, ऑनलाइन या ऑफलाइन।",
      active: "ऑफलाइन मोड सक्रिय",
      desc: "आपके कार्य और मौसमी योजनाएं अभी भी स्थानीय देखने के लिए उपलब्ध हैं।",
      retry: "कनेक्शन पुनः प्रयास करें"
    }
  },
  mr: {
    app_name: "अ‍ॅग्रीस्मार्ट",
    welcome: "स्वागत आहे!",
    season_started: "हंगाम सुरू झाला",
    nav: { home: "होम", scan: "स्कॅन", plan: "नियोजन", market: "बाजार", social: "समुदाय" },
    login: {
      title: "तुमचा मोबाईल नंबर काय आहे?",
      subtitle: "तुमच्या खात्याची पडताळणी करण्यासाठी आणि तुमचा शेती डेटा सुरक्षित ठेवण्यासाठी आम्ही एक OTP पाठवू.",
      placeholder: "00000 00000",
      terms: "पुढे जाऊन, तुम्ही आमच्या सेवा अटी आणि गोपनीयता धोरणाशी सहमत आहात.",
      btn: "OTP पाठवा"
    },
    otp: {
      title: "4-अंकीय कोड प्रविष्ट करा",
      subtitle: "येथे पाठवले",
      resend: "कोड पुन्हा पाठवा",
      resend_in: "कोड पुन्हा पाठवा",
      btn: "सत्यापित करा आणि सुरू करा"
    },
    dashboard: {
      ready: "हंगाम सुरू करण्यास तयार आहात?",
      ready_desc: "तुमच्या विशिष्ट पिकासाठी वैयक्तिक सल्ला, हवामान सूचना आणि उत्पन्न ट्रॅकिंग मिळवा.",
      choose_crop: "पीक निवडा",
      trending: "बाजार भाव",
      view_all: "सर्व पहा",
      priority_task: "प्राधान्य कार्य",
      urgent: "तात्काळ",
      mark_done: "पूर्ण झाले",
      task_completed: "कार्य पूर्ण",
      weather_alert: "हवामान इशारा",
      high_impact: "जास्त प्रभाव"
    },
    weather: {
      title: "हवामान आणि सूचना",
      forecast_7_days: "7-दिवसीय अंदाज",
      advisory_title: "हवामान सल्ला",
      action_required: "शिफारस केलेली कृती",
      humidity: "आद्रता",
      wind_speed: "वाऱ्याचा वेग",
      precip: "पावसाची शक्यता",
      advisory_text: "येत्या 2 दिवसात सतत मुसळधार पावसाची शक्यता. मातीचे संपृक्तता पातळी पीक सहनशीलतेपेक्षा जास्त असू शकते.",
      advisory_action: "ड्रेनेज सिस्टम तपासा",
      today: "आज",
      details: "सध्याची स्थिती"
    },
    scanner: {
      title: "पीक आरोग्य स्कॅनर",
      subtitle: "रोगांचे लवकर निदान करण्यासाठी पाने किंवा देठ स्कॅन करा.",
      take_photo: "फोटो घ्या",
      analyzing: "पिकाचे विश्लेषण...",
      diagnosis: "निदान",
      confidence: "आत्मविश्वास",
      treatment: "शिफारस केलेले उपचार",
      steps: "अनुसरण्याचे टप्पे",
      scan_new: "नवीन वनस्पती स्कॅन करा",
      error: "प्रतिमा विश्लेषणात त्रुटी."
    },
    market: {
      title: "बाजार अंतर्दृष्टी",
      tracking: "किंमत ट्रॅकिंग स्थान",
      tabs: { trends: "किंमत कल", advisor: "विक्री सल्लागार" },
      price: "किंमत",
      connect_btn: "खरेदीदाराशी कनेक्ट व्हा",
      connecting: "कनेक्ट होत आहे...",
      request_sent: "विनंती पाठवली",
      request_msg: "5 सत्यापित व्यापारियों को खरीद अनुरोध भेजा गया.",
      commodities: "जवळपासचे मंडी भाव",
      advisor_title: "हार्वेस्टहब सल्लागार",
      advisor_subtitle: "AI-चालित नफा महत्तमीकरण",
      target_rate: "लक्ष्य दर",
      profitability: "नफाक्षमता",
      sentiment_title: "बाजार भावना",
      sentiment_desc: "80% तेजी - व्यापारी व्हॉल्यूम शोधत आहेत",
      recommendation: { sell: "आता विक्री करा", wait: "वाट पहा" }
    },
    irrigation: {
      title: "सिंचन",
      subtitle: "अचूक पाणी व्यवस्थापन.",
      savings: "मासिक बचत",
      field_status: "शेतीची स्थिती",
      soil: "माती",
      next: "पुढील",
      ai_rec: "AI शिफारस",
      apply_adj: "समायोजन लागू करा",
      zones: {
        north: "उत्तर क्षेत्र",
        east: "पूर्व बाग",
        greenhouse: "ग्रीनहाऊस"
      },
      rec_msg: "येणाऱ्या वादळाचा अंदाज. पाण्याची कार्यक्षमता वाढवण्यासाठी झोन 1 आणि 2 ला 12 तास उशीर करा."
    },
    community: {
      title: "कृषी हब",
      subtitle: "तज्ञ सल्ला आणि शेतकरी समुदाय",
      search_placeholder: "सल्ला किंवा प्रश्न शोधा...",
      filters: { all: "सर्व", advisory: "सल्ला", questions: "प्रश्न" },
      no_posts: "कोणतेही पोस्ट आढळले नाहीत.",
      ask_btn: "प्रश्न विचारा",
      modal: {
        title: "कृषी हब वर पोस्ट करा",
        subtitle: "स्थानिक शेतकऱ्यांसह सामायिक करा",
        label_msg: "तुमचा संदेश",
        label_cat: "श्रेणी",
        btn_publish: "पोस्ट प्रकाशित करा",
        placeholder: "एक प्रश्न विचारा किंवा टिप सामायिक करा..."
      }
    },
    plan: {
      no_plan_title: "कोणतीही सक्रिय पीक योजना नाही",
      no_plan_desc: "सानुकूलित हंगामी योजना तयार करण्यासाठी होम स्क्रीनवरून पीक निवडा.",
      tabs: { overview: "आढावा", calendar: "कैलेंडर", tasks: "कार्ये" },
      complete: "पूर्ण",
      elapsed: "उलटलेले",
      remaining: "उर्वरित",
      days: "दिवस",
      growth_stage: "वाढ टप्पा",
      pending_tasks: "आजची प्रलंबित कामे",
      roadmap: "रोडमॅप वेळेत",
      today: "आज",
      history: "इतिहास",
      quantity: "प्रमाण",
      mark_done: "पूर्ण झाले",
      remind_later: "नंतर आठवण करा",
      stages: {
        sowing: "पेरणी",
        growth: "वाढ",
        flowering: "फुलोरा",
        harvest: "कापणी"
      }
    },
    recommendation: {
      title: "पीक शिफारस",
      insight: "हिंजवडीमधील तुमच्या मातीचा प्रकार आणि सध्याच्या ओलाव्याच्या पातळीवर आधारित, ही 3 पिके उत्पन्न आणि नफ्याचा सर्वोत्तम समतोल देतात.",
      tabs: { list: "शीर्ष निवडी", compare: "तपशीलवार तुलना" },
      profit: "अपेक्षित नफा",
      risk: "जोखीम",
      compare_btn: "तपशील तुलना",
      select_btn: "पीक निवडा",
      back_btn: "सारांशावर परत",
      table: { crop: "पीक", profit: "नफा", yield: "उत्पन्न", cost: "खर्च", price: "किंमत" },
      expert: "तज्ञ सल्ला",
      confirmation: {
        title: "निवडीची पुष्टी करा",
        subtitle: "सुरू करण्यापूर्वी आपल्या निवडीचे पुनरावलोकन करा.",
        start_plan: "पीक योजना सुरू करा",
        risk_warning: "जोखीम विश्लेषण",
        duration_notice: "हंगाम कालावधी",
        cancel: "रद्द करा"
      }
    },
    setup: {
      step1: { title: "चला सुरू करूया", subtitle: "तुमचा अनुभव वैयक्तिक करण्यासाठी आम्हाला तुमच्याबद्दल थोडे सांगा.", name: "पूर्ण नाव", village: "तुमचे गाव" },
      step2: { title: "जमीन तपशील", subtitle: "आम्हाला तुमच्या शेती संसाधनांबद्दल सांगा.", size: "जमिनीचा आकार", source: "पाण्याचा स्रोत", type: "सिंचन प्रकार" },
      step3: { title: "मातीचे आरोग्य", subtitle: "माती चाचणी मूल्ये प्रविष्ट करा किंवा आरोग्य कार्ड अपलोड करा.", upload_btn: "मृदा स्वास्थ्य कार्ड अपलोड करा", or: "किंवा स्वतः प्रविष्ट करा", n: "नायट्रोजन (N)", p: "फॉस्फरस (P)", k: "पोटॅशियम (K)", ph: "pH पातळी", default_msg: "प्रादेशिक सरासरी वापरण्यासाठी रिक्त सोडा." },
      step4: { title: "स्थान निश्चित करा", subtitle: "अति-स्थानिक हवामान सूचनांसाठी तुमची शेती निश्चित करा.", label: "शेतीचे स्थान", warning: "सर्वात अचूक सेन्सर एकत्रीकरणासाठी तुम्ही सध्या तुमच्या शेतावर आहात याची खात्री करा." },
      btn_continue: "पुढे चालू ठेवा",
      btn_finish: "सेटअप पूर्ण करा"
    },
    settings: {
      title: "प्रोफाइल आणि सेटिंग्ज",
      app_section: "अॅप्लिकेशन",
      lang: "भाषा",
      notifications: "पुश सूचना",
      data_sync: "डेटा सिंक",
      support_section: "मदत",
      sign_out: "साइन आउट"
    },
    offline: {
      title: "इंटरनेट नहीं",
      quote: "शेती हा आमचा सर्वात शहाणा प्रयत्न आहे, ऑनलाइन किंवा ऑफलाइन.",
      active: "ऑफलाइन मोड सक्रिय",
      desc: "तुमची कार्ये आणि हंगामी योजना अजूनही स्थानिक पाहण्यासाठी उपलब्ध आहेत.",
      retry: "कनेक्शन पुन्हा प्रयत्न करा"
    }
  }
};
