"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachine = require("javascript-state-machine");
const dist_1 = require("gdl-thesis-core/dist");
const can_exec_helper_1 = require("../auth/can-exec.helper");
/**
 * The state machine helper for the [[InternshipStatusType]]
 */
class InternshipStatusTypeMachine {
    /**
     * Create a new state machine initialized with a state
     * @param initialState The initial state of this machine
     */
    constructor(initialState) {
        /** The allowed transitions */
        this.transitions = [
            { name: 'approved', from: dist_1.InternshipStatusType.NotApproved.toString(), to: dist_1.InternshipStatusType.Approved.toString(), requiredRoles: [dist_1.RoleType.Professor] },
            { name: 'rejected', from: dist_1.InternshipStatusType.NotApproved.toString(), to: dist_1.InternshipStatusType.Rejected.toString(), requiredRoles: [dist_1.RoleType.Professor] },
            { name: 'closed', from: dist_1.InternshipStatusType.Approved.toString(), to: dist_1.InternshipStatusType.Closed.toString(), requiredRoles: [dist_1.RoleType.Company] },
            { name: 'canceled', from: dist_1.InternshipStatusType.NotApproved.toString(), to: dist_1.InternshipStatusType.Canceled.toString(), requiredRoles: [dist_1.RoleType.Company] },
            { name: 'canceled', from: dist_1.InternshipStatusType.Approved.toString(), to: dist_1.InternshipStatusType.Canceled.toString(), requiredRoles: [dist_1.RoleType.Company] }
        ];
        this.stateMachine = new StateMachine({
            init: initialState.toString(),
            transitions: this.transitions
        });
    }
    /**
     * Return all the available state from the current one
     */
    getAvailableStates(userRole) {
        const transitions = this.stateMachine.transitions();
        const currentState = Number(this.stateMachine.state);
        const states = [
            {
                value: currentState,
                text: dist_1.InternshipStatusType[currentState]
            }
        ];
        this.transitions.forEach(t => {
            const transition = userRole ? transitions.find(s => s === t.name && can_exec_helper_1.canExec(userRole, t.requiredRoles)) : transitions.find(s => s === t.name);
            if (transition) {
                const v = Number(t.to);
                if (!states.find(s => s.value === v)) {
                    states.push({
                        value: v,
                        text: dist_1.InternshipStatusType[v]
                    });
                }
            }
        });
        return states;
    }
    /**
     * Return true if exist a transition between the current state and the new state
     * @param newState The new state
     */
    can(newState) {
        if (newState === null || newState === undefined)
            return false;
        const transition = this.transitions.find(t => t.to === newState.toString());
        return this.stateMachine.can(transition.name);
    }
}
exports.InternshipStatusTypeMachine = InternshipStatusTypeMachine;
