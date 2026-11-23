import{PDFDocument,StandardFonts,rgb}from'pdf-lib';import QRCode from'qrcode';import{getEvent}from'../lib/event.js';import{issueToken,verifyToken}from'../lib/tokens.js';
const wrap=(s,max=96)=>{const words=s.split(/\s+/),lines=[];let line='';for(const w of words){if((line+' '+w).length>max&&line){lines.push(line);line=w}else line=line?line+' '+w:w}if(line)lines.push(line);return lines};
export default async function handler(req,res){
res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('X-Content-Type-Options','nosniff');
if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
const origin=req.headers.origin,host=req.headers.host;if(origin&&new URL(origin).host!==host)return res.status(403).json({error:'Invalid request origin.'});
const e=getEvent();if(!e.passAvailable)return res.status(403).json({error:'Pass generation is not open. Check the official event status.'});
try{
const raw=typeof req.body==='string'?JSON.parse(req.body):req.body;const name=typeof raw?.name==='string'?raw.name.trim().replace(/\s+/g,' '):'';
if(!/^[A-Za-z .'-]{3,70}$/.test(name))return res.status(400).json({error:'Enter your full name as shown on your valid photo ID, using English letters.'});
const purpose=typeof raw?.purpose==='string'?raw.purpose.trim().toLowerCase():'';const purposeLabels={interview:'Interview',induction:'Induction',internship:'Internship'};
if(!Object.hasOwn(purposeLabels,purpose))return res.status(400).json({error:'Choose a valid purpose of visit: interview, induction or internship.'});
const token=issueToken(name,purpose),result=verifyToken(token);if(!result.valid)return res.status(400).json({error:'Unable to validate new entry pass.'});const value=result.data;
const rawHost=process.env.PUBLIC_APP_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?'https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL:process.env.VERCEL_URL?'https://'+process.env.VERCEL_URL:'');
if(!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(rawHost))return res.status(503).json({error:'Pass verification URL is not configured.'});
const qrcode=await QRCode.toDataURL(rawHost+'/verify?token='+encodeURIComponent(token),{margin:1,width:360,errorCorrectionLevel:'M',color:{dark:'#11384a',light:'#FFFFFF'}});
const pdf=await PDFDocument.create(),page=pdf.addPage([595.28,841.89]),normal=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold),qr=await pdf.embedPng(qrcode);
const W=595.28,L=45,navy=rgb(.06,.18,.25),green=rgb(.10,.40,.31),muted=rgb(.31,.39,.42),pale=rgb(.91,.95,.92);
page.drawRectangle({x:0,y:752,width:W,height:90,color:navy});
page.drawText('ARISTOVERSE DEEPTECH',{x:L,y:804,font:bold,size:18,color:rgb(1,1,1)});
page.drawText('VISITOR INVITATION / REQUEST FOR CAMPUS ENTRY',{x:L,y:779,font:normal,size:9.3,color:rgb(.78,.91,.86)});
page.drawRectangle({x:L,y:708,width:505,height:29,color:pale});
page.drawText('ORIGINAL PAPER PRINT REQUIRED  -  MOBILE COPIES NOT ACCEPTED',{x:L+11,y:719,font:bold,size:9.6,color:green});
let y=680;
const row=(caption,value)=>{page.drawText(caption.toUpperCase(),{x:L,y,font:bold,size:9,color:muted});const fontSize=Math.min(10.6,365/Math.max(1,normal.widthOfTextAtSize(value,1)));page.drawText(value,{x:175,y,font:normal,size:fontSize,color:navy});y-=27};
row('Visitor',value.name);row('Purpose of visit',purposeLabels[value.purpose]);row('Pass reference',value.ref);row('Event date',new Intl.DateTimeFormat('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kolkata'}).format(new Date(e.beginsAt)));row('Time',e.timeLabel+' IST');
page.drawLine({start:{x:L,y:y+7},end:{x:549,y:y+7},thickness:.8,color:rgb(.76,.83,.78)});y-=18;
page.drawText('TO: CAMPUS SECURITY AND THE AUTHORISED iTNT HUB HOST',{x:L,y,font:bold,size:9.4,color:green});y-=24;
const intro='The named visitor is invited by Aristoverse DeepTech for the purpose of visit specified above. We respectfully request the authorised host and campus security to consider entry, subject to prior host permission, identity checks and applicable campus access rules.';
for(const line of wrap(intro,100)){page.drawText(line,{x:L,y,font:normal,size:10,color:navy});y-=16}y-=13;
page.drawText('LOCATION',{x:L,y,font:bold,size:9,color:green});y-=18;
const place='Aristoverse DeepTech, iTNT Hub, 3rd Floor, Sir C. V. Raman Block, Anna University Campus, Kotturpuram, Chennai - 600025, Tamil Nadu.';
for(const line of wrap(place,93)){page.drawText(line,{x:L,y,font:normal,size:9.8,color:navy});y-=16}y-=16;
page.drawText('GATE REFERENCE',{x:L,y,font:bold,size:9,color:green});y-=18;
page.drawText('Azariah  |  Talent Hunt Team Member - Aristoverse',{x:L,y,font:bold,size:10,color:navy});y-=18;
page.drawText('WhatsApp enquiries: +91 98945 95035',{x:L,y,font:normal,size:9,color:muted});
page.drawRectangle({x:L,y:72,width:505,height:108,color:pale});page.drawImage(qr,{x:456,y:87,width:78,height:78});
page.drawText('MANDATORY CAMPUS ENTRY DOCUMENTS',{x:L+11,y:155,size:9.3,font:bold,color:green});
['1. This original printed entry pass.','2. One valid original government or college photo ID.','3. Photo ID name must match the name shown on this pass.'].forEach((s,i)=>page.drawText(s,{x:L+11,y:136-i*18,font:normal,size:9.3,color:navy}));
page.drawText('This pass is an invitation and request, not an institutional approval.',{x:L,y:52,font:normal,size:8.5,color:muted});
page.drawText('Event revision: '+e.revision+' | An outdated printed pass is invalid after event changes.',{x:L,y:35,font:normal,size:8,color:muted});
const output=await pdf.save();res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Disposition','attachment; filename="aristoverse-entry-'+value.ref+'.pdf"');return res.status(200).send(Buffer.from(output));
}catch(err){return res.status(400).json({error:err?.message==='PASS_UNAVAILABLE'?'Pass generation is not currently available.':'Unable to create a pass. Please try again later.'})}
}