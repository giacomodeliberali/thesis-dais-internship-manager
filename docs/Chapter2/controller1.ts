/**
 * Update the state of an [[Internship]] following the [[InternshipStatusTypeMachine]] transition function
 */
private useUpdateStates() {
    this.router.put('/status', [ownInternshipProposal],
        async (req, res) => {
            try {
                const internshipProposalId = req.body.id;
                const newState: 
                    InternshipProposalStatusType = req.body.status;

                // Get the internship
                const internshipProposal = await 
                    this.internshipProposalsRepository
                            .get(internshipProposalId);

                // ... do stuff ...

                // Return the updated internship proposal
                return new ApiResponse({
                    data: internshipProposal,
                    httpCode: 200,
                    response: res
                }).send();
            } catch (ex) {
                // return ex
            }
        });
    return this;
}