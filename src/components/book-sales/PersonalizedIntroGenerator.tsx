
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Zap } from 'lucide-react';
import { generatePersonalizedIntro } from '@/ai/flows/personalized-book-intro';

export function PersonalizedIntroGenerator() {
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [generatedIntro, setGeneratedIntro] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setGeneratedIntro('');
        try {
            const result = await generatePersonalizedIntro({ name, mortgageBalance: parseFloat(balance) });
            setGeneratedIntro(result.intro);
        } catch (err) {
            setError('Could not generate your preview. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-slate-800 border-yellow-400 border-2 shadow-2xl shadow-yellow-500/20 text-white">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl text-yellow-400">Read YOUR Personalized First Page</CardTitle>
                <CardDescription className="text-slate-300">Enter your info below to see the book come to life with your numbers.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name" className="text-slate-300">First Name</Label>
                            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jane" required className="bg-slate-900 border-slate-700 text-white"/>
                        </div>
                        <div>
                            <Label htmlFor="balance" className="text-slate-300">Mortgage Balance</Label>
                            <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="e.g., 450000" required className="bg-slate-900 border-slate-700 text-white"/>
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold text-lg">
                        {isLoading ? <Loader2 className="animate-spin" /> : <><Zap className="mr-2 h-5 w-5"/>Generate My Preview</>}
                    </Button>
                </form>

                {generatedIntro && (
                    <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-lg text-yellow-300 mb-2">Here is your personalized Chapter 1 preview:</h4>
                        <p className="text-slate-200 whitespace-pre-wrap font-serif text-lg leading-relaxed">{generatedIntro}</p>
                    </div>
                )}
                {error && <p className="mt-4 text-center text-red-400">{error}</p>}
            </CardContent>
        </Card>
    );
}
