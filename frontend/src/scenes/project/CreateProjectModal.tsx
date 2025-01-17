import { Alert, Input, Modal } from 'antd'
import { useActions } from 'kea'
import React, { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
import { teamLogic } from 'scenes/teamLogic'

export function CreateProjectModal({
    isVisible,
    setIsVisible,
}: {
    isVisible: boolean
    setIsVisible: Dispatch<SetStateAction<boolean>>
}): JSX.Element {
    const { createTeam } = useActions(teamLogic)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const inputRef = useRef<Input | null>(null)

    const closeModal: () => void = useCallback(() => {
        setErrorMessage(null)
        setIsVisible(false)
        if (inputRef.current) inputRef.current.setValue('')
    }, [inputRef, setIsVisible])

    return (
        <Modal
            title="Creating a Project"
            okText="Create Project"
            cancelText="Cancel"
            onOk={() => {
                const name = inputRef.current?.state.value?.trim()
                if (name) {
                    setErrorMessage(null)
                    createTeam(name)
                    closeModal()
                } else {
                    setErrorMessage('Your project needs a name!')
                }
            }}
            onCancel={closeModal}
            visible={isVisible}
        >
            <p>
                Projects are a way of tracking multiple products under the umbrella of a single organization.
                <br />
                All organization members will be able to access the new project.
            </p>
            <Input
                addonBefore="Name"
                ref={inputRef}
                placeholder='for example "Global Website"'
                maxLength={64}
                autoFocus
            />
            {errorMessage && <Alert message={errorMessage} type="error" style={{ marginTop: '1rem' }} />}
        </Modal>
    )
}
