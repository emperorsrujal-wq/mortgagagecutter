
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, AlertTriangle, ChevronsRight, BookOpen, Pizza, Film, Headphones, ShoppingCart, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loan Killers: India’s Hidden EMI Secret - अब EMI के जाल से बाहर निकलें',
  description: 'बिना extra income कमाए अपने 20-30 साल के होम लोन को 8-12 सालों में खत्म करें। यह किताब आपको EMI का वो राज़ बताएगी जो बैंक कभी नहीं बताते।',
  robots: { 
    index: true,
    follow: true,
  }
};

const caseStudies = [
    { 
        name: "अमित & पूजा (IT कपल – पुणे)",
        loanAmount: "₹52 लाख",
        tenure: "25 साल",
        interestBefore: "₹60–65 लाख+",
        tenureAfter: "~13–14 साल",
        savings: "₹18–22 लाख",
        quote: "हमको लगा था होम लोन तो रिटायरमेंट तक चलेगा। अब पहली बार लगता है कि अपने 40s में घर फ़्री हो सकता है।",
        avatarId: "testimonial-amit-pooja"
    },
    { 
        name: "सीमा (सरकारी टीचर – जयपुर)",
        loanAmount: "₹28 लाख",
        tenure: "20 साल",
        tenureAfter: "~9–10 साल",
        savings: "₹9–10 लाख",
        quote: "पहले लगता था 55–56 तक EMI भरूँगी। अब लगता है 45–46 तक घर क्लियर हो सकता है – वो भी मेरी वर्तमान सैलरी से।",
        avatarId: "testimonial-seema"
    },
    { 
        name: "रोहित (सेल्स प्रोफेशनल – अहमदाबाद)",
        loanAmount: "₹40 लाख",
        tenure: "20 साल",
        tenureAfter: "~11–12 साल",
        savings: "₹12–15 लाख",
        quote: "पहले इंसेंटिव = शॉपिंग और गैजेट्स था। अब इंसेंटिव = लोन फ्री डेट जल्दी लाना है।",
        avatarId: "testimonial-rohit"
    },
    { 
        name: "निशा (फ्रीलांसर – बेंगलुरु)",
        loanAmount: "₹35 लाख",
        tenure: "18 साल",
        tenureAfter: "~10–11 साल",
        savings: "तनाव कम, नियंत्रण ज़्यादा",
        quote: "पहले EMI मुझे कंट्रोल कर रही थी। अब सिस्टम मेरे कंट्रोल में है।",
        avatarId: "testimonial-nisha"
    }
];

const priceComparisons = [
    { icon: Pizza, text: "1-2 बार बाहर डिनर / ऑनलाइन फूड ऑर्डर", value: "₹500-800" },
    { icon: Headphones, text: "एक महीने की OTT / म्यूजिक सब्सक्रिप्शन", value: "₹299-799" },
    { icon: Film, text: "वीकेंड मूवी + पॉपकॉर्न", value: "₹700-1200" },
    { icon: ShoppingCart, text: "एक जोड़ी चप्पल / सस्ते जूते", value: "₹400-800" }
];


export default function BookSalesHindiPageV2() {
  const bookCoverImage = PlaceHolderImages.find(p => p.id === 'book-cover');

  return (
    <div className="bg-gray-100 text-gray-900 font-sans">
      <header className="bg-gray-900 text-white text-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="font-semibold text-yellow-400">ज़्यादातर भारतीय अपनी ज़िंदगी EMI भरते–भरते निकाल देते हैं…</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mt-2">
            क्या आप भी मान चुके हैं कि आपका होम लोन अगले 20–25 साल तक चलना ही है?
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300">
            जानिए वो “Loan Killer System” जो आम इंडियन होमओनर्स को उनके लोन के साल 5–10 साल तक घटाने में मदद कर रहा है – और ब्याज़ में लाखों रुपये बचाने में… <span className="font-bold">बिना इनकम बढ़ाए, बिना रिस्की इन्वेस्टमेंट किए।</span>
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Pain Section */}
        <section className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-red-700">EMI देते–देते थक गए हैं… पर लोन कम ही नहीं हो रहा?</h2>
          <div className="mt-6 text-lg text-gray-700 space-y-4 text-left p-6 bg-white rounded-xl shadow-lg border">
            <p>हर महीने वही कहानी: सैलरी आती है, EMI कटती है, बाकी बिल, किराना, पेट्रोल, स्कूल फ़ीस… और महीने के आख़िर तक अकाउंट फिर लगभग खाली।</p>
            <p className="font-bold">और जब आप होम लोन स्टेटमेंट खोलते हैं, तो दिल बैठ जाता है: ज़्यादातर पैसा Interest में जा चुका है।</p>
            <p className="bg-red-50 text-red-800 p-3 rounded-lg font-semibold text-center">अंदर से डर लगता है: “कहीं पूरी ज़िंदगी EMI भरते–भरते ही न निकल जाए…”</p>
            <p className="mt-4 text-xl font-bold text-center">अगर ये फीलिंग आपकी भी है, तो एक बात साफ़ है: समस्या आप नहीं हैं। <span className="text-blue-700 underline">समस्या वो सिस्टम है जिसमें आपको फँसाया गया है।</span></p>
          </div>
        </section>
        
        {/* Solution Intro */}
        <section className="bg-blue-600 text-white rounded-2xl p-8 md:p-12 text-center mb-16 shadow-2xl">
            <h2 className="text-4xl font-extrabold mb-4">अब अच्छी खबर…</h2>
            <p className="text-xl mb-6 max-w-3xl mx-auto">इंडिया में ही एक दूसरा मॉडल भी मौजूद है, जिसे मैं इस किताब में कहता हूँ: <strong className="block text-3xl font-bold text-yellow-300 mt-2">“Liquid Home Loan System™”</strong></p>
            {bookCoverImage && (
                 <div className="max-w-xs mx-auto my-8 shadow-2xl">
                    <Image src={bookCoverImage.imageUrl} alt="Loan Killers Book Cover" width={400} height={600} className="rounded-lg" data-ai-hint={bookCoverImage.imageHint} />
                </div>
            )}
            <h3 className="text-2xl font-bold">पेश है: Loan Killers – India’s Hidden EMI Secret जिसे बैंक कभी नहीं बताते</h3>
            <p className="mt-2 text-yellow-300 font-bold text-3xl">प्रीमियम ईबुक कीमत: सिर्फ़ ₹399</p>
            <Button asChild size="lg" className="mt-8 text-xl py-7 bg-yellow-400 text-black hover:bg-yellow-500 animate-pulse">
                <Link href="/purchase?plan=book_399">
                    <ChevronsRight className="mr-2 h-6 w-6"/> हाँ, मुझे EMI के जाल से बाहर निकलना है!
                </Link>
            </Button>
        </section>
        
        {/* Social Proof */}
        <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">“ये सब असल में काम करता है?” – देखिए ये रिज़ल्ट्स 👇</h2>
            <p className="text-center text-sm text-muted-foreground mb-8 max-w-2xl mx-auto">⚠️ नाम बदले गए हैं, पर स्ट्रक्चर और अंदाज़े असली जैसे केस पर आधारित हैं। आपके लोन के नंबर अलग होंगे – सिस्टम वही रहेगा।</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {caseStudies.map((cs, i) => {
                    const avatar = PlaceHolderImages.find(p => p.id === cs.avatarId);
                    return (
                        <Card key={i} className="shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="flex flex-row items-center gap-4">
                                {avatar && <Image src={avatar.imageUrl} alt={cs.name} width={60} height={60} className="rounded-full" data-ai-hint={avatar.imageHint} />}
                                <CardTitle>{cs.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-1 mb-4 border-t pt-4">
                                    <p><strong>लोन अमाउंट:</strong> {cs.loanAmount}</p>
                                    <p><strong>पुराना टेन्योर:</strong> {cs.tenure}</p>
                                    <p className="text-green-700 font-bold"><strong>नया टेन्योर (अनुमानित):</strong> {cs.tenureAfter}</p>
                                    <p className="text-green-700 font-bold"><strong>ब्याज़ में संभावित बचत:</strong> {cs.savings}</p>
                                </div>
                                <blockquote className="border-l-4 border-blue-300 pl-4 italic text-muted-foreground">"{cs.quote}"</blockquote>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </section>

        {/* What you will learn */}
        <section className="mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">इस किताब में आप क्या–क्या सीखेंगे?</h2>
            <Accordion type="single" collapsible className="w-full bg-white p-4 rounded-xl shadow-lg border">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold">🔹 1. EMI सिस्टम का असली चेहरा</AccordionTrigger>
                <AccordionContent>EMI का hidden गणित, "EMI कम, टेन्योर लंबा" वाली मीठी बात असल में कितनी महँगी पड़ती है, और Balance Transfer/Top-up कैसे आपको और सालों तक बाँध देते हैं।</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold">🔹 2. Closed Money vs Liquid Money</AccordionTrigger>
                <AccordionContent>Closed Money (पैसा गया = गया) vs Liquid Money (पैसा आपके पास भी रहता है, और रोज़ आपका लोन काटता भी है) का फर्क समझें और अपनी पोज़िशन कैसे बदलें।</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold">🔹 3. Liquid Home Loan System™ – अंदर से कैसे काम करता है</AccordionTrigger>
                <AccordionContent>कौन से फीचर्स एक अकाउंट को Liquid Home Loan जैसा बनाते हैं और कैसे सैलरी/इनकम पहले लोन को हिट करके फिर खर्चों की तरफ़ फ्लो होती है।</AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold">🔹 4. Loan Killer Action Plan – Step by Step</AccordionTrigger>
                <AccordionContent>अपना EMI स्टेटमेंट सही से पढ़ना, बैंक से पूछने के लिए ready-made सवाल, अपना monthly cashflow सेट करना, और हर साल टेन्योर और ब्याज़ की गिरावट को ट्रैक करने की आसान ट्रिक।</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-semibold">🔹 5. Mindset Shift</AccordionTrigger>
                <AccordionContent>"बस EMI दे रहा हूँ" से "मैं सिस्टम को हरा रहा हूँ" तक का सफ़र। फैमिली को मिशन में शामिल करना और घर की "Loan Free Date" को टार्गेट की तरह प्लान करना।</AccordionContent>
              </AccordionItem>
            </Accordion>
        </section>
        
        {/* Value Anchor / Price Justification */}
        <section className="mb-16 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold">अब प्राइस की बात – और इसे जस्टिफ़ाई करना बहुत आसान है</h2>
            <p className="mt-4 text-lg text-muted-foreground">अगर इस किताब की मदद से आपका टेन्योर 3–5 साल भी कम हो जाए या ब्याज़ में सिर्फ़ ₹2–5 लाख भी बच जाए, तो क्या ₹399 उसकी तुलना में कुछ मायने रखता है?</p>
            <Card className="mt-8 p-6 bg-white shadow-xl border">
                <CardTitle className="mb-4">₹399 vs आपकी रोज़मर्रा की खर्चे:</CardTitle>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-muted-foreground">
                    {priceComparisons.map((item, i) => {
                        const Icon = item.icon;
                        return (
                             <div key={i} className="flex flex-col items-center gap-2">
                                <Icon className="h-8 w-8 text-blue-500" />
                                <p className="text-sm">{item.text}</p>
                                <p className="font-bold text-gray-800">{item.value}</p>
                            </div>
                        )
                    })}
                </div>
                 <p className="mt-6 text-lg font-bold">एक तरफ़ 1 शाम का मज़ा, दूसरी तरफ़ ज़िंदगी भर की फ़ाइनेंशियल आज़ादी का रास्ता।</p>
            </Card>
        </section>

        {/* Final Offer */}
        <section className="text-center">
             <Card className="max-w-2xl mx-auto bg-gray-900 text-white shadow-2xl border-4 border-yellow-400">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">ये सिर्फ़ ईबुक नहीं, ये आपके होम लोन का “Owner’s Manual” है।</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-5xl font-extrabold text-yellow-400">
                       सिर्फ़ ₹399
                    </p>
                    <ul className="space-y-2 text-left max-w-md mx-auto">
                        <li className="flex items-start"><CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>पूरी Loan Killers ईबुक (PDF/eBook)</span></li>
                        <li className="flex items-start"><CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>EMI vs Liquid Home Loan की क्लियर समझ</span></li>
                        <li className="flex items-start"><CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>Real-like केस स्टडीज़</span></li>
                        <li className="flex items-start"><CheckCircle className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>स्टेप–बाय–स्टेप Loan Killer Action Plan</span></li>
                    </ul>
                    <Button asChild size="lg" className="mt-6 w-full text-xl py-8 animate-pulse bg-green-600 hover:bg-green-700">
                        <Link href="/purchase?plan=book_399">
                            <ChevronsRight className="mr-2 h-6 w-6"/> अभी Loan Killers सिर्फ़ ₹399 में लें!
                        </Link>
                    </Button>
                    <p className="text-xs text-gray-400 mt-2 flex items-center justify-center"><ShieldCheck className="h-3 w-3 mr-1" /> 100% सुरक्षित पेमेंट</p>
                </CardContent>
            </Card>

            <div className="mt-12 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold">आख़िर में – दो साफ़ रास्ते</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-left">
                    <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
                        <h4 className="font-bold text-red-800">रास्ता #1: सब कुछ वैसे ही रहने दें</h4>
                        <ul className="text-sm text-red-700 list-disc pl-5 mt-2 space-y-1">
                            <li>EMI कटती रहे</li>
                            <li>Principal धीरे–धीरे घटता रहे</li>
                            <li>लोन 20–25 साल आपका पीछा करता रहे</li>
                        </ul>
                    </div>
                     <div className="p-4 border border-green-300 bg-green-50 rounded-lg">
                        <h4 className="font-bold text-green-800">रास्ता #2: आज सिस्टम बदलें</h4>
                        <ul className="text-sm text-green-700 list-disc pl-5 mt-2 space-y-1">
                            <li>Loan Killers डाउनलोड करें</li>
                            <li>EMI सिस्टम को अंदर से समझें</li>
                            <li>ब्याज़ के लाखों रुपये बचाने की दिशा में कदम बढ़ाएँ</li>
                        </ul>
                    </div>
                </div>
                <p className="mt-8 text-lg font-semibold">अगर आप EMI से थक चुके हैं और चाहते हैं कि आपका घर बोझ नहीं, आज़ादी का एहसास बने…</p>
                <Button asChild size="lg" className="mt-4 text-xl py-7 bg-blue-700 hover:bg-blue-800">
                    <Link href="/purchase?plan=book_399">
                       अभी अपनी कॉपी लें – और EMI का एंड गेम बदल दें
                    </Link>
                </Button>
            </div>
        </section>

      </main>
    </div>
  );
}
