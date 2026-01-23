
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, X, AlertTriangle, ChevronsRight, Award, Lock } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'India’s Hidden EMI Secret: LOAN KILLERS – अब EMI के जाल से बाहर निकलें',
  description: 'बिना extra income कमाए अपने 20-30 साल के होम लोन को 8-12 सालों में खत्म करें। यह किताब आपको EMI का वो राज़ बताएगी जो बैंक कभी नहीं बताते।',
  robots: { 
    index: true,
    follow: true,
  }
};

const FAQ_ITEMS = [
    {
        question: "अगर मैं पहले से 5-10 साल EMI भर चुका हूँ, तो क्या यह किताब मेरे काम आएगी?",
        answer: "बिल्कुल! असल में, यह आपके लिए और भी ज़्यादा ज़रूरी है। शुरुआती सालों में ही सबसे ज़्यादा interest जाता है। यह किताब आपको बताएगी कि बचे हुए लोन को तेज़ी से कैसे खत्म करें और अभी भी लाखों का ब्याज बचाएँ।"
    },
    {
        question: "क्या मुझे अपना बैंक बदलना पड़ेगा या कोई नया Loan लेना पड़ेगा?",
        answer: "ज़रूरी नहीं। यह किताब आपको एक 'सोच' और 'strategy' सिखाती है। आप अपने मौजूदा बैंक के ODHL (Overdraft Home Loan) जैसे प्रोडक्ट्स के साथ भी इसे लागू कर सकते हैं, या फिर किसी भी बैंक के साथ जो flexible loan प्रोडक्ट्स ऑफर करता है। यह बैंक बदलने के बारे में नहीं, बल्कि loan चलाने का तरीका बदलने के बारे में है।"
    },
    {
        question: "क्या यह किताब कोई particular investment या product बेचती है?",
        answer: "नहीं। यह किताब कोई 'get-rich-quick' स्कीम, स्टॉक टिप या इंश्योरेंस पॉलिसी नहीं बेचती। यह सिर्फ और सिर्फ आपको home loan EMI के system को समझाने और उसे अपने फायदे के लिए इस्तेमाल करने की knowledge देती है।"
    },
    {
        question: "ODHL या Open Money System कहीं risky तो नहीं है?",
        answer: "हर financial tool की तरह, इसमें भी discipline की ज़रूरत होती है। यह किताब आपको इसका risk management सिखाती है। असल में, 20-30 साल तक एक fixed EMI के जाल में फँसे रहना, जहाँ आपकी कोई liquidity नहीं होती, ज़्यादा risky है। यह सिस्टम आपको ज़्यादा control और flexibility देता है।"
    },
    {
        question: "अगर मैं numbers में weak हूँ तो क्या मैं यह सब समझ पाऊँगा?",
        answer: "हाँ! इस किताब को खासतौर पर आम सैलरीड इंसान के लिए लिखा गया है। इसमें मुश्किल फाइनेंस jargon की जगह आसान भाषा और इंडियन उदाहरणों का इस्तेमाल किया गया है, ताकि कोई भी इसे आसानी से समझ सके और लागू कर सके।"
    }
];

export default function BookSalesHindiPage() {
  const bookCoverImage = PlaceHolderImages.find(p => p.id === 'book-cover');

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      <div className="text-center py-3 bg-yellow-400 text-black font-bold text-sm px-4 shadow-md">
        <AlertTriangle className="inline-block h-4 w-4 mr-1" /> चेतावनी: यह पेज एक ऐसा राज़ खोलता है जिसे आपका बैंक कभी नहीं चाहेगा कि आप जानें।
      </div>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            क्या आप Home Loan की EMI चुका रहे हैं, या बैंक के मुनाफ़े की किश्तें भर रहे हैं?
          </h1>
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-700 font-semibold">
            पेश है <span className="underline decoration-yellow-400 decoration-4">India’s Hidden EMI Secret:</span> वो तरीका जिससे आप बिना Extra Income कमाए अपने 20-30 साल के होम लोन को 8-12 सालों में खत्म कर सकते हैं।
          </p>
        </div>

        <Card className="mt-12 max-w-3xl mx-auto bg-white shadow-xl">
          <CardContent className="p-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              महीने की पहली तारीख़। Salary क्रेडिट होने का मैसेज आता है, और उसके ठीक 5 मिनट बाद एक और SMS...
              <br/><br/>
              <strong className="font-bold text-red-700 text-xl">"Dear Customer, your account has been debited for EMI of Rs. 45,780..."</strong>
              <br/><br/>
              आप स्टेटमेंट देखते हैं, और आपका दिल बैठ जाता है। ₹45,780 में से ₹35,000 तो सिर्फ ब्याज (interest) में चला गया! आपके 50 लाख के लोन में से Principal तो बस ₹10,780 ही कम हुआ।
              <br/><br/>
              <span className="bg-red-100 p-2 rounded-md">हर महीने यही कहानी... आपकी मेहनत की कमाई का बड़ा हिस्सा बैंक ले जाता है, और आपका लोन कछुए की चाल से कम होता है।</span>
              <br/><br/>
              आपके दिमाग में वो डर बैठ गया है: अगर कल जॉब चली गई तो? अगर घर में कोई बड़ी medical emergency आ गई तो? क्या सच में 20-30 साल तक इसी EMI Trap में फँसे रहना पड़ेगा?
            </p>
          </CardContent>
        </Card>

        <div className="mt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">लेकिन क्या हो अगर आप बैंक के बनाए इस खेल को उसी के नियमों से पलट दें?</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">एक ऐसा सिस्टम जो आपकी नॉर्मल salary को ही आपके लोन का सबसे बड़ा दुश्मन बना दे। एक ऐसी स्ट्रैटेजी जो आपको EMI के जाल से निकालकर, सालों पहले Loan-Free बना दे।</p>
          <h3 className="mt-8 text-2xl sm:text-3xl font-bold text-blue-700">पेश है वो किताब जो आपको यह राज़ बताएगी...</h3>
        </div>

        <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-900 text-white p-8 rounded-2xl shadow-2xl">
          <div className="text-center md:text-left">
            <h4 className="text-4xl font-bold tracking-tighter">India's Hidden EMI Secret – <span className="text-yellow-400">LOAN KILLERS</span></h4>
            <p className="mt-4 text-gray-300 text-lg">वो 220 पन्नों की प्रैक्टिकल गाइड जो आपको EMI के जाल से आज़ाद करेगी।</p>
            {bookCoverImage && (
              <div className="mt-6 md:hidden">
                <Image src={bookCoverImage.imageUrl} alt="LOAN KILLERS Book Cover" width={400} height={600} className="rounded-lg shadow-lg mx-auto" data-ai-hint={bookCoverImage.imageHint} />
              </div>
            )}
            <h5 className="font-bold text-xl mt-6 mb-3 text-yellow-400">इस किताब में आप क्या-क्या सीखेंगे:</h5>
            <ul className="space-y-3 text-left">
              <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">“Amortization Trap” क्या है:</strong> और कैसे यह आपके पहले 5-10 साल की EMI को almost पूरा interest में बदल देता है।</span></li>
              <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">50 लाख का लोन 1 करोड़ कैसे बन जाता है:</strong> सिर्फ इसलिए क्योंकि आपने standard EMI path blindly follow किया।</span></li>
              <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">Balance Transfer, Top-up, Refinance:</strong> ये दोस्त हैं या दुश्मन? जानिए बैंक के इन "helping hands" का असली सच।</span></li>
              <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">“Open Money System”:</strong> वो सोच जो आपके home loan को life sentence नहीं, बल्कि एक smart financial tool में बदल देती है।</span></li>
              <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">Cash Flow का जादू:</strong> बिना salary बढ़ाए, सिर्फ planning बदलकर interest में लाखों की बचत कैसे करें।</span></li>
               <li className="flex items-start"><Check className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" /><span><strong className="text-white">The "Loan Killer" Plan:</strong> Step-by-step अपना खुद का amortization analysis करें और अपने परिवार के लिए personal “Loan Killer” प्लान बनाएँ।</span></li>
            </ul>
          </div>
          <div className="hidden md:block">
            {bookCoverImage && (
              <Image src={bookCoverImage.imageUrl} alt="LOAN KILLERS Book Cover" width={400} height={600} className="rounded-lg shadow-2xl" data-ai-hint={bookCoverImage.imageHint} />
            )}
          </div>
        </div>
        
        <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-white shadow-2xl border-4 border-yellow-400">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">हाँ! मैं EMI के जाल से आज़ाद होना चाहता हूँ।</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-5xl font-extrabold text-gray-900">
                       आज ही अपनी कॉपी ऑर्डर करें सिर्फ़...
                        <span className="text-green-600 block mt-2">
                           <span className="text-3xl text-gray-500 line-through mr-2">₹999</span>
                           ₹299 में!
                        </span>
                    </p>
                    
                    <Button asChild size="lg" className="mt-4 w-full text-xl py-8 animate-pulse bg-green-600 hover:bg-green-700">
                        <Link href="/purchase?plan=book_37">
                            <ChevronsRight className="mr-2 h-6 w-6"/> हाँ! मुझे ₹299 में अपनी कॉपी चाहिए!
                        </Link>
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 flex items-center justify-center"><Lock className="h-3 w-3 mr-1" /> 100% सुरक्षित पेमेंट</p>
                </CardContent>
            </Card>
        </div>

        <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">यह किताब किन लोगों के लिए है (और किनके लिए नहीं)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Check className="text-green-600"/> यह आपके लिए है अगर...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>आप एक सैलरीड प्रोफेशनल हैं और होम लोन EMI से परेशान हैं।</li>
                            <li>आप पहली बार घर खरीदने की planning कर रहे हैं और EMI के जाल से बचना चाहते हैं।</li>
                            <li>आप अपने पैसों पर control चाहते हैं, और बैंक को अपनी मेहनत की कमाई interest में नहीं देना चाहते।</li>
                            <li>आप एक NRI हैं जो इंडिया में property loan चला रहे हैं।</li>
                        </ul>
                    </CardContent>
                </Card>
                 <Card className="bg-red-50 border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><X className="text-red-600"/> यह आपके लिए नहीं है अगर...</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <ul className="list-disc pl-5 space-y-2">
                            <li>आप रातों-रात अमीर बनने वाली कोई scheme ढूँढ रहे हैं।</li>
                            <li>आप stock market tips या crypto gamble की तलाश में हैं।</li>
                            <li>आप "zero down payment में 4 फ्लैट" जैसे shortcuts चाहते हैं।</li>
                            <li>आप अपने financial future को लेकर serious नहीं हैं।</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto border-dashed border-2 p-6 bg-blue-50 border-blue-300">
                 <div className="mx-auto bg-blue-200 h-16 w-16 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-inner">
                    <Award className="h-8 w-8 text-blue-700"/>
                 </div>
                <h3 className="text-xl font-bold text-blue-800">हमारी 30-दिन की "Knowledge Guarantee"</h3>
                <p className="mt-2 text-gray-600">हमारा वादा सीधा है: इस किताब को पढ़ें। अगर आपको ऐसा नहीं लगता कि इससे आपको EMI सिस्टम की ऐसी deep understanding मिली है जो आपके लाखों रुपये बचा सकती है, तो बस 30 दिनों के अंदर हमें एक ईमेल भेजिए। हम आपके पूरे पैसे वापस कर देंगे। कोई सवाल नहीं पूछा जाएगा। यह हमारा भरोसा है अपनी knowledge पर।</p>
            </Card>
        </div>

         <div className="mt-16 text-center">
             <h2 className="text-3xl font-bold">आज ही फैसला करें: अगले 20 साल तक EMI भरें, या 8-12 साल में आज़ाद हों?</h2>
             <p className="mt-4 text-lg text-gray-600">सिर्फ़ ₹299 में, आप उस गुलामी से आज़ादी की चाबी पा सकते हैं। आपका future self आपको धन्यवाद देगा।</p>
             <Button asChild size="lg" className="mt-6 w-full max-w-lg text-xl py-8 bg-green-600 hover:bg-green-700">
                <Link href="/purchase?plan=book_37">
                    हाँ! मुझे अपनी Financial Freedom चाहिए!
                </Link>
            </Button>
            <p className="text-xs text-gray-500 mt-2 flex items-center justify-center"><Lock className="h-3 w-3 mr-1" /> 100% सुरक्षित पेमेंट</p>
         </div>
         
         <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">अक्सर पूछे जाने वाले सवाल (FAQ)</h2>
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>

      </main>
    </div>
  );
}
