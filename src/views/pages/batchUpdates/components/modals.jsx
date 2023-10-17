import React, { useState } from 'react';
import { Button, Modal } from 'reactstrap';

export const ConfirmModal = (props) => {
    const { modalState, closeModal, ordersAdded, execute } = props;

    const [ confirmation, setConfirmation ] = useState(false);
    const openConfirmation = () => setConfirmation(true);
    const closeConfirmation = () => setConfirmation(false);

    return (
        <Modal
            className="modal-dialog-centered modal-danger"
            contentClassName="bg-gradient-default"
            isOpen={modalState}
            toggle={closeModal}
        >
            <div className="modal-header">
                <h6
                    className="modal-title"
                    id="modal-title-notification"
                >
                    Your attention is required
                </h6>
                <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={closeModal}
                >
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="py-3 text-center">
                    <i className="ni ni-bell-55 ni-3x" />
                    <h4 className="heading mt-4">
                        This action needs your confirmation!
                    </h4>
                    <p>
                        This action will modify {ordersAdded.length} orders. Confirm to continue. 
                    </p>
                </div>
            </div>
            <div className="modal-footer">
                {!(confirmation) ? (
                    <Button
                        className="btn-white"
                        color="default"
                        type="button"
                        onClick={openConfirmation}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        className="btn-white"
                        color="default"
                        type="button"
                        onClick={execute}
                        onMouseOut={closeConfirmation}
                    >
                        Confirm
                    </Button>
                )}

                <Button
                    className="text-white ml-auto"
                    color="link"
                    data-dismiss="modal"
                    type="button"
                    onClick={closeModal}
                >
                    Cancel
                </Button>
            </div>
        </Modal>
    )
}