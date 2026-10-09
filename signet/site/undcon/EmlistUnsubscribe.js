/*********************************************************************************
**********************************************************************************
**             LEGAL NOTICE & INTELLECTUAL PROPERTY PROTECTIONS                 **
**                                                                              **
** COPYRIGHT NOTICE:                                                            **
** © 2026 Mudafuka Holdings Ltd. All Rights Reserved.                           **
** The content of this website, including but not limited to text, source code, **
** and layout, is protected as a literary work under the Copyright Act          **
** (17 U.S.C. § 101 et seq.) and international copyright treaties.              **
**                                                                              **
** TRADEMARK NOTICE:                                                            **
** All logos, brand names, and service marks displayed on this site are         **
** trademarks of Mudafuka Holdings Ltd. or their respective owners.             **
** Unauthorized use of these trademarks is strictly prohibited.                 **
**                                                                              **
** RESTRICTIONS:                                                                **
** No part of this work may be reproduced, distributed, or transmitted in any   ** 
** form or by any means, including photocopying, recording, or other electronic ** 
** or mechanical methods, without prior written permission from the owner.      **
**                                                                              **
**********************************************************************************
*********************************************************************************/

/*
 * MultiConnect - Build Progress Email Subscription Submission
 *
 * Browser-side submission handler for the Signet Ninja
 * MultiConnect Build Proggress Email Subscription Submission form.
 */

async function EmlistUnsubscribe(event) {
    event.preventDefault();

    const form = event.currentTarget.closest("form");

    /*
     * Confirm that the form satisfies its native HTML validation
     * requirements before attempting submission.
     */
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    /*
     * Locate the form's existing status elements.
     */
    const loading = form.querySelector(".loading");
    const errorMessage = form.querySelector(".error-message");
    const sentMessage = form.querySelector(".sent-message");
    const submitButton = form.querySelector('button[type="submit"]');

    /*
     * Reset the visible submission state.
     */
    loading.style.display = "block";
    errorMessage.style.display = "none";
    sentMessage.style.display = "none";
    submitButton.disabled = true;

    /*
     * Construct the JSON payload expected by the
     * MultiConnect Policy Update Notification Email Subscription Worker.
     */
    const payload = {
        "emlist-unsub.email":
            document.getElementById("emlist-unsub.email").value,

        "emlist-unsub.all":
            document.getElementById("emlist-unsub.all").checked,
      
        "emlist-unsub.polupann":
            document.getElementById("emlist-unsub.polupann").checked,
        
        "emlist-unsub.genemnl":
            document.getElementById("emlist-unsub.genemnl").checked,
  
        "emlist-unsub.buildprog":
            document.getElementById("emlist-unsub.buildprog").checked,
  
        "emlist-unsub.platupann":
            document.getElementById("emlist-unsub.platupann").checked,

        "emlist-unsub.jobopens":
            document.getElementById("emlist-unsub.jobopens").checked,

        "emlist-unsub.newprods":
            document.getElementById("emlist-unsub.newprods").checked,

        "emlist-unsub.events":
            document.getElementById("emlist-unsub.events").checked,

        "emlist-unsub":
            document.getElementById("emlist-unsub").checked

    };

    try {
        /*
         * Submit the message to the dedicated Signet Ninja
         * MultiConnect Policy Update Notification Email Subscription Worker.
         */
        const response = await fetch(
            "https://caerbannog-00c1d70301a9471286af154e9d2703f0.signetninja-prod.workers.dev/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        /*
         * The Worker returns JSON for both successful and
         * controlled failure responses.
         */
        const result = await response.json();

        if (!response.ok || result.success !== true) {
            throw new Error("Subscription submission failed.");
        }

        /*
         * Submission succeeded.
         */
        form.reset();
        sentMessage.style.display = "block";
    }
    catch (error) {
        /*
         * Do not expose Worker, Graph, SharePoint, or other
         * infrastructure details to the user.
         */
        console.error("Subscription Submission failed.");

        errorMessage.textContent =
            "We couldn't process your subscription submission. Please try again.";

        errorMessage.style.display = "block";
    }
    finally {
        loading.style.display = "none";
        submitButton.disabled = false;
    }
}
