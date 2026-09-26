<?php

namespace App\Http\Controllers\Admin;  // ← مهم: Admin

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Concerns\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    use LogsActivity;

    public function index(Request $request)
    {
        $status = $request->get('status', 'all');

        $query = Contact::latest();

        if ($status === 'new') {
            $query->where('status', 'new');
        } elseif ($status === 'replied') {
            $query->where('status', 'replied');
        } elseif ($status === 'closed') {
            $query->where('status', 'closed');
        }

        return Inertia::render('Admin/Contacts/Index', [
            'contacts' => $query->paginate(15)->through(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'email' => $c->email,
                'subject' => $c->subject,
                'message' => mb_substr($c->message, 0, 100) . (mb_strlen($c->message) > 100 ? '...' : ''),
                'status' => $c->status,
                'status_label' => $c->status_label,
                'created_at' => $c->created_at->diffForHumans(),
            ]),
            'filters' => [
                'status' => $status,
            ],
            'stats' => [
                'total' => Contact::count(),
                'new' => Contact::where('status', 'new')->count(),
                'replied' => Contact::where('status', 'replied')->count(),
            ],
        ]);
    }

    public function show(Contact $contact)
    {
        return Inertia::render('Admin/Contacts/Show', [
            'contact' => [
                'id' => $contact->id,
                'name' => $contact->name,
                'email' => $contact->email,
                'subject' => $contact->subject,
                'message' => $contact->message,
                'status' => $contact->status,
                'reply' => $contact->reply,
                'created_at' => $contact->created_at->format('Y/m/d H:i'),
                'replied_at' => $contact->replied_at?->format('Y/m/d H:i'),
            ],
        ]);
    }

    public function reply(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'reply' => 'required|string|min:10',
            'status' => 'required|in:new,replied,closed',
            'attachment' => 'nullable|file|max:10240',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('contacts', 'public');
        }

        $contact->update([
            'reply' => $validated['reply'],
            'status' => $validated['status'],
            'attachment' => $attachmentPath ?? $contact->attachment,
            'replied_at' => now(),
        ]);

        $this->logActivity('reply', "پاسخ به پیام «{$contact->subject}» ارسال شد", Contact::class, $contact->id);

        return back()->with('success', 'پاسخ با موفقیت ثبت شد!');
    }

    public function destroy(Contact $contact)
    {
        return $this->forceDelete($contact);
    }

    public function forceDelete(Contact $contact)
    {
        $subject = $contact->subject;
        $contact->delete();

        $this->logActivity('delete', "پیام تماس «{$subject}» حذف شد", Contact::class, $contact->id);

        return redirect()->route('admin.contacts.index')->with('success', 'پیام حذف شد!');
    }
}