// MediScale Digital Website Logic Controller

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Interactive Ophthalmic ROI Calculator Logic
    const procedureSelect = document.getElementById('calc-procedure');
    const budgetInput = document.getElementById('calc-budget');
    const budgetValue = document.getElementById('budget-val');
    const ticketInput = document.getElementById('calc-ticket');
    const ticketValue = document.getElementById('ticket-val');

    const resultLeads = document.getElementById('res-leads');
    const resultBookings = document.getElementById('res-bookings');
    const resultRevenue = document.getElementById('res-revenue');
    const resultRoi = document.getElementById('res-roi');

    const procedures = {
        lasik:    { label: "LASIK / SMILE",              value: 100000, cpql: 1750, bookingRate: 0.34 },
        cataract: { label: "Premium Cataract (Multifocal/Trifocal)", value: 160000, cpql: 1550, bookingRate: 0.30 },
        icl:      { label: "ICL (Implantable Collamer Lens)", value: 200000, cpql: 2000, bookingRate: 0.28 }
    };

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    }

    function calculateROI() {
        const procKey = procedureSelect ? procedureSelect.value : 'lasik';
        const proc = procedures[procKey] || procedures.lasik;
        const budget = parseInt(budgetInput.value) || 0;
        const avgTreatmentValue = proc.value;

        // Update display labels
        if (budgetValue) budgetValue.textContent = formatCurrency(budget);
        if (ticketValue) ticketValue.textContent = formatCurrency(avgTreatmentValue);
        if (ticketInput) ticketInput.value = avgTreatmentValue;

        // Formula:
        // qualifiedLeads = adBudget / cpql
        // bookedConsultations = qualifiedLeads * bookingRate
        // projectedRevenue = bookedConsultations * avgTreatmentValue
        // estimatedROAS = projectedRevenue / adBudget
        const qualifiedLeads = Math.round(budget / proc.cpql);
        const bookedConsultations = Math.round(qualifiedLeads * proc.bookingRate);
        const projectedRevenue = bookedConsultations * avgTreatmentValue;
        const estimatedROAS = budget > 0 ? Math.round(projectedRevenue / budget) : 0;

        // Animate results
        if (resultLeads) animateValue(resultLeads, qualifiedLeads);
        if (resultBookings) animateValue(resultBookings, bookedConsultations);
        if (resultRevenue) resultRevenue.textContent = formatCurrency(projectedRevenue);
        if (resultRoi) resultRoi.textContent = `${estimatedROAS}x`;
    }

    function animateValue(element, target) {
        let current = parseInt(element.textContent) || 0;
        if (current === target) return;
        const duration = 300;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = (target - current) / steps;
        let count = 0;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.round(current);
            count++;
            if (count >= steps) {
                clearInterval(timer);
                element.textContent = target;
            }
        }, stepTime);
    }

    if (budgetInput && procedureSelect) {
        budgetInput.addEventListener('input', calculateROI);
        procedureSelect.addEventListener('change', calculateROI);
        // Initialize default
        calculateROI();
    }

    // 4. Simulated Video Player Interactions
    const videoPreview = document.getElementById('demo-video');
    if (videoPreview) {
        videoPreview.addEventListener('click', () => {
            // Replace preview with simulated active player
            const innerHTML = `
                <div style="position:absolute;inset:0;background:#030712;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:20px;text-align:center;">
                    <div class="video-playing-indicator" style="margin-bottom:20px;position:relative;width:60px;height:60px;display:flex;justify-content:center;align-items:center;">
                        <span style="position:absolute;width:100%;height:100%;border:4px solid var(--primary);border-radius:50%;animation:ping 1.5s infinite;opacity:0.6;"></span>
                        <span style="font-size:24px;">🔬</span>
                    </div>
                    <h3 style="font-size:18px;margin-bottom:8px;color:var(--primary);">Playing Case Study Video</h3>
                    <p style="font-size:13px;color:var(--text-muted);max-width:300px;margin-bottom:20px;">Patient Acquisition Engine Walkthrough & Dashboard Demonstration</p>
                    <div style="width:200px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;margin-bottom:12px;">
                        <div id="video-progress" style="width:0%;height:100%;background:linear-gradient(90deg, var(--primary), var(--secondary));"></div>
                    </div>
                    <div style="display:flex;gap:15px;font-size:12px;color:var(--text-dim);">
                        <span id="video-time">0:00</span>
                        <span>/</span>
                        <span>1:45</span>
                    </div>
                </div>
            `;
            videoPreview.style.cursor = 'default';
            videoPreview.innerHTML = innerHTML;
            
            // Progress bar animation simulator
            let progress = 0;
            const progressEl = document.getElementById('video-progress');
            const timeEl = document.getElementById('video-time');
            
            const interval = setInterval(() => {
                progress += 1;
                if (progressEl) progressEl.style.width = `${progress}%`;
                
                // Simulate time count
                const totalSeconds = Math.floor((progress / 100) * 105);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                if (timeEl) timeEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                if (progress >= 100) {
                    clearInterval(interval);
                    if (videoPreview) {
                        videoPreview.innerHTML = `
                            <div style="position:absolute;inset:0;background:rgba(7,11,25,0.9);display:flex;flex-direction:column;justify-content:center;align-items:center;padding:30px;">
                                <span style="font-size:40px;color:var(--accent);margin-bottom:15px;">✓</span>
                                <h3 style="font-size:20px;margin-bottom:10px;">Video Completed</h3>
                                <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;text-align:center;">Learn how we can replicate this patient flow for your specific clinic.</p>
                                <button class="btn btn-primary open-audit-modal-btn">Schedule Strategy Call</button>
                            </div>
                        `;
                        // Attach modal trigger to new button
                        const newBtn = videoPreview.querySelector('.open-audit-modal-btn');
                        if (newBtn) {
                            newBtn.addEventListener('click', openModal);
                        }
                    }
                }
            }, 300); // Fast forward presentation
        });
    }

    // 5. FAQ Accordion Click Handlers
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-btn');
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-content').style.maxHeight = null;
            });

            // Toggle selected
            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.faq-content');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // 6. Modal Lead Form Handling
    const modal = document.getElementById('audit-modal');
    const openModalBtns = document.querySelectorAll('.open-modal-trigger');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const auditForm = document.getElementById('audit-form');

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
    }

    openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Submit form handler
    if (auditForm) {
        auditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const name = document.getElementById('form-name').value;
            const clinic = document.getElementById('form-clinic').value;
            const procedure = document.getElementById('form-specialty').value;
            
            const procedureLabels = {
                lasik: 'LASIK / SMILE',
                cataract: 'Premium Cataract',
                icl: 'ICL',
                comprehensive: 'Comprehensive Eye Surgery OT'
            };
            const procedureLabel = procedureLabels[procedure] || 'Ophthalmic';

            // Display simulated success state
            const modalCard = modal.querySelector('.modal-card');
            modalCard.innerHTML = `
                <div style="text-align:center;padding:30px 10px;">
                    <div style="width:70px;height:70px;background:rgba(16,185,129,0.1);border-radius:50%;border:2px solid var(--accent);display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px;color:var(--accent);font-size:32px;animation:float 3s ease-in-out infinite;">✓</div>
                    <h3 style="font-size:24px;font-family:'Outfit',sans-serif;margin-bottom:12px;color:var(--text-main);">Strategy Blueprint Requested!</h3>
                    <p style="font-size:15px;color:var(--text-muted);line-height:1.6;margin-bottom:30px;">
                        Thank you, <strong>${name}</strong>. We are preparing an ophthalmic patient acquisition blueprint for <strong>${clinic}</strong> with a focus on <strong>${procedureLabel}</strong>. 
                        Our team will contact you within the next 24 hours to schedule your strategy session.
                    </p>
                    <button class="btn btn-primary" id="success-close-btn" style="width:100%;">Return to Website</button>
                </div>
            `;

            const successCloseBtn = document.getElementById('success-close-btn');
            if (successCloseBtn) {
                successCloseBtn.addEventListener('click', closeModal);
            }
        });
    }
});
