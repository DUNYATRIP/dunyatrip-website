(() => {
 const config={
  cars:{title:"Car Rentals",eyebrow:"Move your way",headline:"Find the right ride for your journey",intro:"Tell us where you need a car and our team will help with suitable rental options.",button:"Search Cars",fields:[
   ["PICK-UP LOCATION","pickup","text","City, airport or address",true],
   ["DROP-OFF LOCATION","dropoff","text","Same as pick-up or another location",true],
   ["PICK-UP DATE","pickupDate","date","",true],
   ["PICK-UP TIME","pickupTime","time","",false],
   ["RETURN DATE","returnDate","date","",true],
   ["RETURN TIME","returnTime","time","",false],
   ["CAR TYPE","carType","select",["Any car","Economy","Compact","Sedan","SUV","Luxury","Van"],true],
   ["DRIVER / PASSENGERS","passengers","select",["1 passenger","2 passengers","3 passengers","4 passengers","5 passengers","6+ passengers"],true]
  ],introCard:"From airport transfers to family road trips, share your route and preferred vehicle."},
  tours:{title:"Tours & Experiences",eyebrow:"Make memories",headline:"Discover experiences worth travelling for",intro:"Plan a city break, family outing or private adventure with DunyaTrip.",button:"Find Tours",fields:[
   ["DESTINATION","destination","text","City or country",true],
   ["TRAVEL DATE","travelDate","date","",true],
   ["DURATION","duration","select",["Half day","1 day","2–3 days","4–7 days","Flexible"],true],
   ["TRAVELLERS","travellers","select",["1 person","2 people","3 people","4 people","5–8 people","9+ people"],true],
   ["TOUR STYLE","tourStyle","select",["City sightseeing","Family tour","Adventure","Nature & wildlife","Cultural experience","Private tour","Any"],true],
   ["BUDGET PER PERSON","budget","select",["Flexible","Budget","Mid-range","Premium"],false],
   ["SPECIAL REQUESTS","notes","textarea","Tell us what you would love to do",false]
  ],introCard:"From guided city tours to private experiences, let us help shape your itinerary."},
  umrah:{title:"Umrah Packages",eyebrow:"A journey of faith",headline:"Let us help plan your Umrah journey",intro:"Share your preferred travel dates and package needs. Our team will guide you through the arrangements.",button:"Request Umrah Options",fields:[
   ["DEPARTURE CITY","departureCity","text","Your city in Pakistan",true],
   ["PREFERRED TRAVEL DATE","travelDate","date","",true],
   ["TRIP DURATION","duration","select",["7–10 days","11–14 days","15–20 days","21–30 days","Flexible"],true],
   ["PACKAGE CATEGORY","packageType","select",["Economy","Standard","Premium","Luxury","Need guidance"],true],
   ["TRAVELLERS","travellers","select",["1 person","2 people","3 people","4 people","5–8 people","9+ people"],true],
   ["HOTEL PREFERENCE","hotelPreference","select",["Near Haram","Walking distance preferred","Shuttle service acceptable","Need guidance"],false],
   ["ROOM REQUIREMENT","roomRequirement","select",["Sharing","Double","Triple","Quad","Family room","Need guidance"],false],
   ["ADDITIONAL DETAILS","notes","textarea","Any special requirements",false]
  ],introCard:"Ask about flights, Makkah and Madinah hotels, transport and package arrangements."},
  visa:{title:"Visa Assistance",eyebrow:"Travel with clarity",headline:"Get guidance for your next visa application",intro:"Tell us your destination and visa purpose. We will help you understand the process and document requirements.",button:"Request Visa Guidance",fields:[
   ["DESTINATION COUNTRY","destination","text","Which country are you applying for?",true],
   ["VISA CATEGORY","visaType","select",["Tourist / Visit","Family Visit","Business","Student","Transit","Other / Not sure"],true],
   ["EXPECTED TRAVEL DATE","travelDate","date","",false],
   ["NUMBER OF APPLICANTS","applicants","select",["1 applicant","2 applicants","3 applicants","4 applicants","5+ applicants"],true],
   ["CURRENT RESIDENCE","residence","text","City and country",false],
   ["PREVIOUS VISA REFUSAL?","refusal","select",["No","Yes","Prefer to discuss"],true],
   ["SUPPORT REQUIRED","support","select",["Visa guidance","Eligibility discussion","Document checklist","Application review","Full assistance"],true],
   ["ADDITIONAL DETAILS","notes","textarea","Share any details that may help us guide you",false]
  ],introCard:"Our team can guide you on processes and documents. Visa decisions are made only by the relevant authorities."},
  appointments:{title:"Appointment Assistance",eyebrow:"Get organised",headline:"Need help with an embassy appointment?",intro:"Tell us which appointment you need and your preferred location and date.",button:"Request Appointment Help",fields:[
   ["APPOINTMENT TYPE","appointmentType","select",["Embassy / Visa appointment","Biometrics appointment","Passport / Consular appointment","Document submission","Travel consultation","Other"],true],
   ["COUNTRY / EMBASSY","country","text","Country or embassy",true],
   ["CITY","city","text","Preferred city",true],
   ["NUMBER OF APPLICANTS","applicants","select",["1 applicant","2 applicants","3 applicants","4 applicants","5+ applicants"],true],
   ["PREFERRED DATE","preferredDate","date","",false],
   ["PREFERRED TIME","preferredTime","select",["Any time","Morning","Afternoon"],false],
   ["ADDITIONAL DETAILS","notes","textarea","Tell us about your appointment requirement",false]
  ],introCard:"We provide appointment guidance and assistance subject to official appointment availability."},
  "file-preparation":{title:"Visa File Preparation",eyebrow:"Documents made clearer",headline:"Prepare your travel documents with confidence",intro:"Tell us the destination and type of application so our team can guide you through the paperwork.",button:"Request File Assistance",fields:[
   ["FILE TYPE","fileType","select",["Visit visa file","Tourist visa file","Business visa file","Family visit visa file","Student visa file","Umrah documents","Other travel documents"],true],
   ["DESTINATION COUNTRY","destination","text","Which country?",true],
   ["EXPECTED TRAVEL DATE","travelDate","date","",false],
   ["NUMBER OF APPLICANTS","applicants","select",["1 applicant","2 applicants","3 applicants","4 applicants","5+ applicants"],true],
   ["ASSISTANCE REQUIRED","assistance","select",["Complete file preparation","Document checklist","Document review","Application form assistance","Cover letter guidance"],true],
   ["ADDITIONAL DETAILS","notes","textarea","Any specific questions or circumstances",false]
  ],introCard:"We help organise documents and explain checklists. Final requirements depend on the embassy or authority."},
  insurance:{title:"Travel Insurance",eyebrow:"Travel with peace of mind",headline:"Find travel cover for your next trip",intro:"Share your destination, travel dates and group size to request suitable insurance options.",button:"Get Insurance Options",fields:[
   ["INSURANCE TYPE","insuranceType","select",["Single-trip travel insurance","Schengen travel insurance","Family travel insurance","Group travel insurance","Annual multi-trip","Not sure"],true],
   ["DESTINATION / REGION","destination","text","Country or region",true],
   ["TRIP START DATE","startDate","date","",true],
   ["TRIP END DATE","endDate","date","",true],
   ["NUMBER OF TRAVELLERS","travellers","select",["1 traveller","2 travellers","3 travellers","4 travellers","5–8 travellers","9+ travellers"],true],
   ["TRAVELLER AGE RANGE","ageRange","select",["Under 18","18–30","31–45","46–60","61–70","Over 70","Mixed ages"],false],
   ["COVER PREFERENCE","cover","select",["Basic","Comprehensive","Schengen compliant","Need guidance"],false],
   ["ADDITIONAL DETAILS","notes","textarea","Any requirements you would like us to know",false]
  ],introCard:"Coverage, eligibility and prices depend on the insurer and policy terms."}
 };
 const key=document.body.dataset.service;
 const data=config[key]; if(!data)return;
 document.title=data.title+" | DunyaTrip";
 document.getElementById("serviceEyebrow").textContent=data.eyebrow;
 document.getElementById("serviceHeadline").textContent=data.headline;
 document.getElementById("serviceIntro").textContent=data.intro;
 document.getElementById("serviceCardTitle").textContent=data.title+" enquiry";
 document.getElementById("serviceCardIntro").textContent=data.introCard;
 const host=document.getElementById("serviceFields");
 host.innerHTML=data.fields.map(([label,id,type,opts,required])=>{
  let control="";
  if(type==="select")control='<select id="'+id+'" name="'+id+'" '+(required?"required":"")+'><option value="">Select an option</option>'+opts.map(v=>'<option>'+v+'</option>').join("")+'</select>';
  else if(type==="textarea")control='<textarea id="'+id+'" name="'+id+'" placeholder="'+opts+'" '+(required?"required":"")+'></textarea>';
  else control='<input id="'+id+'" name="'+id+'" type="'+type+'" '+(opts? 'placeholder="'+opts+'"':'')+' '+(required?"required":"")+' autocomplete="off">';
  return '<div class="field '+(type==="textarea"?"wide":"")+'"><label for="'+id+'">'+label+'</label>'+control+'</div>';
 }).join("");
 const form=document.getElementById("serviceForm"),contact=document.getElementById("contactStep"),phone=document.getElementById("customerPhone"),submit=document.getElementById("serviceSubmit"),feedback=document.getElementById("serviceFeedback");
 form.addEventListener("submit",e=>{
  e.preventDefault();
  if(form.dataset.contactReady==="yes"){send();return;}
  if(!form.reportValidity())return;
  contact.hidden=false;phone.required=true;form.dataset.contactReady="yes";submit.textContent="Submit Enquiry →";feedback.textContent="Apna WhatsApp number enter karein. Hamari team aap se rabta karegi.";phone.focus();
 });
 async function send(){
  if(!phone.value.trim()){phone.reportValidity();return;}
  const values=[...host.querySelectorAll("input,select,textarea")].filter(x=>x.value.trim()).map(x=>(x.closest(".field").querySelector("label").textContent+": "+x.value.trim()));
  const details=data.title+" enquiry\nWhatsApp: "+phone.value.trim()+"\n"+values.join("\n");
  const whatsapp="https://wa.me/923071201353?text="+encodeURIComponent("DunyaTrip Enquiry\n"+details+"\n\nPlease contact this customer.");
  const waWindow=window.open("about:blank","_blank");
  submit.disabled=true;submit.textContent="Sending…";feedback.textContent="Aapki enquiry submit ho rahi hai…";
  try{
   const cfg=window.DUNYATRIP_SUPABASE_CONFIG||{},url=cfg.url||"",key=cfg.anonKey||"";
   if(!url.startsWith("https://")||!key)throw new Error("Enquiry saving is not configured. Please contact us on WhatsApp.");
   const firstDate=host.querySelector('input[type="date"]');
   const response=await fetch(url.replace(/\/$/,"")+"/rest/v1/enquiries",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({customer_name:"Website visitor",phone:phone.value.trim(),service_type:key==="cars"?"Other":key==="tours"?"Other":key==="umrah"?"Umrah":key==="visa"?"Visa":key==="appointments"?"Visa":key==="file-preparation"?"Visa":"Other",travel_date:firstDate?.value||null,message:details})});
   if(!response.ok){const err=await response.json().catch(()=>({}));throw new Error(err.message||err.details||"Could not save your enquiry. Please try again.");}
   if(waWindow)waWindow.location.href=whatsapp;else window.location.href=whatsapp;
   feedback.textContent="Thank you! Your enquiry has been saved. Our team will contact you.";
   form.reset();contact.hidden=true;phone.required=false;form.dataset.contactReady="";
  }catch(err){if(waWindow)waWindow.close();feedback.textContent=err.message||"Something went wrong. Please try again.";feedback.classList.add("error");}
  finally{submit.disabled=false;submit.textContent=data.button+" →";}
 }
 document.getElementById("currentYear").textContent=new Date().getFullYear();
 const country=document.getElementById("countrySelect"),currency=document.getElementById("currencySelect");
 country?.addEventListener("change",()=>{currency.value=({PK:"PKR",AE:"AED",SA:"SAR",GB:"GBP",US:"USD"})[country.value]||"PKR";});
})();