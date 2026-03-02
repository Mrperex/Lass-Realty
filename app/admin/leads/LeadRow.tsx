'use client';

import { useState } from 'react';
import { updateLeadStatus, addLeadNote } from './actions';
import { format } from 'date-fns';
import { Mail, Phone, Home, Calendar, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { ILead } from '@/types/lead';

export default function LeadRow({ lead }: { lead: any }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [showNotes, setShowNotes] = useState(false);

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsUpdating(true);
        await updateLeadStatus(lead._id, e.target.value);
        setIsUpdating(false);
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteText.trim()) return;

        setIsUpdating(true);
        await addLeadNote(lead._id, noteText);
        setNoteText('');
        setIsUpdating(false);
    };

    const statusColors: Record<string, string> = {
        new: 'bg-blue-50 text-blue-700 border-blue-200',
        contacted: 'bg-amber-50 text-amber-700 border-amber-200',
        qualified: 'bg-purple-50 text-purple-700 border-purple-200',
        closed: 'bg-green-50 text-green-700 border-green-200',
    };

    const currentStatusColor = statusColors[lead.status] || statusColors.new;

    return (
        <>
            <tr className={`hover:bg-slate-50 transition-colors ${isUpdating ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{lead.name}</span>
                        <a href={`mailto:${lead.email}`} className="text-sm text-amber-600 hover:underline flex items-center gap-1 mt-1">
                            <Mail className="w-3 h-3" /> {lead.email}
                        </a>
                        <a href={`tel:${lead.phone}`} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" /> {lead.phone}
                        </a>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {lead.propertySlug ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-semibold border border-slate-200">
                            <Home className="w-3 h-3" />
                            {lead.propertySlug}
                        </span>
                    ) : (
                        <span className="text-sm text-slate-400 italic">General Inquiry</span>
                    )}
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 max-w-sm whitespace-pre-wrap">{lead.message}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {lead.createdAt ? format(new Date(lead.createdAt), 'MMM d, yyyy') : 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <select
                                value={lead.status || 'new'}
                                onChange={handleStatusChange}
                                disabled={isUpdating}
                                className={`text-xs font-bold rounded-full px-3 py-1 border outline-none appearance-none cursor-pointer text-center ${currentStatusColor}`}
                            >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="closed">Closed</option>
                            </select>
                            <button
                                onClick={() => setShowNotes(!showNotes)}
                                className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-1 font-medium bg-slate-100 px-2 py-1.5 rounded-lg transition-colors"
                            >
                                <MessageSquare className="w-3 h-3" />
                                {lead.notes?.length || 0} Notes
                                {showNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
            {showNotes && (
                <tr className="bg-slate-50/50 border-b border-slate-200">
                    <td colSpan={4} className="px-6 py-4">
                        <div className="max-w-2xl bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-sm font-bold text-slate-900 mb-3">Internal Notes</h4>

                            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                                {!lead.notes || lead.notes.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                                ) : (
                                    lead.notes.map((note: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-100">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-semibold text-amber-600">Agent Note</span>
                                                <span className="text-xs text-slate-400">{format(new Date(note.createdAt), 'MMM d, h:mm a')}</span>
                                            </div>
                                            <p className="text-slate-700">{note.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={handleAddNote} className="flex gap-2">
                                <input
                                    type="text"
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Add a new note..."
                                    className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                    disabled={isUpdating}
                                />
                                <button
                                    type="submit"
                                    disabled={isUpdating || !noteText.trim()}
                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
