const venues={
unconfirmed:{label:'Venue to be confirmed',address:'Sathyabama (OMR) and Anna University (Guindy) are tentative options.'},
sathyabama:{label:'Aristocrat Startup Cell, Sathyabama',address:'Centre for Innovation and Technology Transfer, 3rd Floor, Advanced Studies Block, Sathyabama, Old Mahabalipuram Road, Chennai - 600119, Tamil Nadu, India.'},
annau:{label:'Aristoverse at iTNT Hub, Anna University',address:'3rd Floor, Sir C. V. Raman Block, Anna University Campus, Kotturpuram, Chennai - 600025, Tamil Nadu, India.'}
};
export function getEvent(now=new Date()){
const date=/^\d{4}-\d{2}-\d{2}$/.test(process.env.EVENT_DATE||'')?process.env.EVENT_DATE:'2026-11-25';
const time=/^([01]\d|2[0-3]):[0-5]\d$/.test(process.env.EVENT_TIME||'')?process.env.EVENT_TIME:'14:00';
const venue=Object.hasOwn(venues,process.env.EVENT_VENUE||'')?process.env.EVENT_VENUE:'unconfirmed';
const status=['tentative','confirmed','rescheduled','digital','cancelled'].includes(process.env.EVENT_STATUS)?process.env.EVENT_STATUS:'tentative';
const revision=String(process.env.EVENT_REVISION||'1');
const duration=Math.max(30,Math.min(720,Number(process.env.EVENT_DURATION_MINUTES)||180));
const begins=new Date(date+'T'+time+':00+05:30'),ends=new Date(begins.getTime()+duration*60000);
const release=new Date(new Date(date+'T00:00:00+05:30').getTime()-86400000);
const timeFormat=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',hour:'numeric',minute:'2-digit',hour12:true});
const ready=['confirmed','rescheduled'].includes(status)&&venue!=='unconfirmed'&&process.env.VENUE_APPROVED==='true'&&(process.env.PASS_SIGNING_SECRET||'').length>=32;
return{date,time,venue,status,revision,locationName:venues[venue].label,fullAddress:venues[venue].address,beginsAt:begins.toISOString(),endsAt:ends.toISOString(),tokenReleaseAt:release.toISOString(),timeLabel:timeFormat.format(begins)+' – '+timeFormat.format(ends),passReady:ready,passAvailable:ready&&now>=release&&now<begins};
}
