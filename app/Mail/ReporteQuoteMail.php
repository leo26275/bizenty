<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class ReporteQuoteMail extends Mailable
{
    use Queueable, SerializesModels;

    public $quotationHead;
    public $quotationDtl;
    public $companyConfig;

    /**
     * Create a new message instance.
     */
    public function __construct($quotationHead, $quotationDtl, $companyConfig)
    {
        $this->quotationHead = $quotationHead;
        $this->quotationDtl = $quotationDtl;
        $this->companyConfig = $companyConfig;
    }


    public function build()
    {
        $pdf = Pdf::loadView('reports.quotation', ['quotationHead' => $this->quotationHead, 'quotationDtl' => $this->quotationDtl, 'companyConfig' => $this->companyConfig]);
        $reportName = "Quote-".str_pad($this->quotationHead->id, 8, '0', STR_PAD_LEFT);
        $filename =  $reportName . ".pdf";

        return $this->subject($reportName)
            ->html('<p>Attached you will find the quotation file.</p>')
            //->view('emails.plain')
            ->attachData($pdf->output(), $filename, [
                'mime' => 'application/pdf',
            ]);
    }



    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reporte Quote Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
