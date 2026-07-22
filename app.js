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

    // 2. Specialty Tabs Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const calcSpecialty = document.getElementById('calc-specialty');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Switch tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Sync with ROI calculator specialty dropdown
            if (tabId === 'dentists' && calcSpecialty) {
                calcSpecialty.value = 'dentist';
                updateCalculatorDefaults('dentist');
            } else if (tabId === 'ophthalmologists' && calcSpecialty) {
                calcSpecialty.value = 'ophthalmic';
                updateCalculatorDefaults('ophthalmic');
            }
        });
    });

    // 3. Interactive ROI Calculator Logic
    const budgetInput = document.getElementById('calc-budget');
    const budgetValue = document.getElementById('budget-val');
    const ticketInput = document.getElementById('calc-ticket');
    const ticketValue = document.getElementById('ticket-val');

    const resultLeads = document.getElementById('res-leads');
    const resultBookings = document.getElementById('res-bookings');
    const resultRevenue = document.getElementById('res-revenue');
    const resultRoi = document.getElementById('res-roi');

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    }

    function updateCalculatorDefaults(specialty) {
        if (specialty === 'dentist') {
            // Typical dental implant / Invisalign ticket size in INR: e.g. 40,000
            ticketInput.min = 5000;
            ticketInput.max = 150000;
            ticketInput.value = 45000;
            ticketInput.step = 5000;
        } else {
            // Typical LASIK / Cataract ticket size in INR: e.g. 70,000
            ticketInput.min = 10000;
            ticketInput.max = 250000;
            ticketInput.value = 85000;
            ticketInput.step = 5000;
        }
        ticketValue.textContent = formatCurrency(ticketInput.value);
        calculateROI();
    }

    function calculateROI() {
        const specialty = calcSpecialty ? calcSpecialty.value : 'dentist';
        const budget = parseInt(budgetInput.value);
        const ticket = parseInt(ticketInput.value);

        // Update range labels
        budgetValue.textContent = formatCurrency(budget);
        ticketValue.textContent = formatCurrency(ticket);

        // Benchmark variables based on our historical data
        // Dentist: CPL ~500 INR, CPQL ~1100 INR. Booking rate with support ~38%
        // Ophthalmic: CPL ~750 INR, CPQL ~1600 INR. Booking rate with support ~34%
        let cpql = specialty === 'dentist' ? 1200 : 1800;
        let bookingRate = specialty === 'dentist' ? 0.38 : 0.34;

        // Calculate metrics
        const qualifiedLeads = Math.floor(budget / cpql);
        const patientsBooked = Math.floor(qualifiedLeads * bookingRate);
        const estimatedRevenue = patientsBooked * ticket;
        
        let roiMultiplier = budget > 0 ? (estimatedRevenue / budget).toFixed(1) : 0;

        // Animate results update
        animateValue(resultLeads, qualifiedLeads);
        animateValue(resultBookings, patientsBooked);
        resultRevenue.textContent = formatCurrency(estimatedRevenue);
        resultRoi.textContent = `${roiMultiplier}x`;
    }

    function animateValue(element, target) {
        let current = parseInt(element.textContent) || 0;
        if (current === target) return;
        const duration = 400;
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

    if (budgetInput && ticketInput && calcSpecialty) {
        budgetInput.addEventListener('input', calculateROI);
        ticketInput.addEventListener('input', calculateROI);
        calcSpecialty.addEventListener('change', () => {
            updateCalculatorDefaults(calcSpecialty.value);
            // Switch tabs corresponding to calculator dropdown selection
            const targetTab = calcSpecialty.value === 'dentist' ? 'dentists' : 'ophthalmologists';
            tabBtns.forEach(btn => {
                if (btn.getAttribute('data-tab') === targetTab) {
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
            tabContents.forEach(c => {
                if (c.getAttribute('id') === targetTab) {
                    tabContents.forEach(tc => tc.classList.remove('active'));
                    c.classList.add('active');
                }
            });
        });

        // Initialize values
        updateCalculatorDefaults('dentist');
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
            const specialty = document.getElementById('form-specialty').value;
            
            // Display simulated success state
            const modalCard = modal.querySelector('.modal-card');
            modalCard.innerHTML = `
                <div style="text-align:center;padding:30px 10px;">
                    <div style="width:70px;height:70px;background:rgba(16,185,129,0.1);border-radius:50%;border:2px solid var(--accent);display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px;color:var(--accent);font-size:32px;animation:float 3s ease-in-out infinite;">✓</div>
                    <h3 style="font-size:24px;font-family:'Outfit',sans-serif;margin-bottom:12px;color:var(--text-main);">Diagnostic Requested!</h3>
                    <p style="font-size:15px;color:var(--text-muted);line-height:1.6;margin-bottom:30px;">
                        Thank you, <strong>${name}</strong>. We are preparing a custom patient acquisition blueprint for <strong>${clinic}</strong> (${specialty === 'dentist' ? 'Dental' : 'Ophthalmic'} focus). 
                        Our team will contact you within the next 24 hours to schedule your session.
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
