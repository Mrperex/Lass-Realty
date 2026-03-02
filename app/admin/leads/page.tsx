import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { Mail, Phone, Home, Calendar } from 'lucide-react';
import LeadRow from './LeadRow';

export const revalidate = 0;

export default async function AdminLeadsPage() {
    await connectToDatabase();

    const leads = await Lead.find().sort({ createdAt: -1 }).lean();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Lead Inbox</h1>
                <p className="text-slate-500 mt-2">Manage inquiries and prospective clients.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {leads.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Details</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Message</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date received</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {leads.map((lead: any) => (
                                    <LeadRow key={lead._id.toString()} lead={lead} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Inbox Empty</h3>
                        <p className="text-slate-500 max-w-sm">You haven&apos;t received any leads yet. When users submit the contact form, they will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
