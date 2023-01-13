import React, {useEffect, useState} from 'react'
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import { Button } from '@mui/material'
import { SynapseClient, Typography } from 'synapse-react-client'
import { displayToast } from 'synapse-react-client/dist/containers/ToastMessage'
import { ChangePasswordWithToken, PasswordResetSignedToken } from 'synapse-react-client/dist/utils/synapseTypes/ChangePasswordRequests'
import { getSearchParam, hexDecodeAndDeserialize } from 'URLUtils'

export type ResetPasswordProps = {
    returnToUrl:string
}

export const ResetPassword = (props: ResetPasswordProps) => {
    const [userName, setUserName] = useState('')
    const [token, setToken] = useState<PasswordResetSignedToken | undefined>()
    const [newPassword, setNewPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const passwordResetTokenValue = getSearchParam('passwordResetToken')

    useEffect(() => {
        if(passwordResetTokenValue){
            const hexDecodedPasswordResetToken = hexDecodeAndDeserialize(passwordResetTokenValue)
            setToken(hexDecodedPasswordResetToken)
        }
    },[])

    const handleResetPassword = async (clickEvent: React.FormEvent<HTMLElement>) => {
        clickEvent.preventDefault()
        try{
            await SynapseClient.resetPassword(userName)
                .then(() => {
                    displayToast("If a matching account was found, then your password reset request has been sent. Please check your email.",'success')
                })
                .catch((err: any) => {displayToast(err.reason as string, 'danger')
            })
        } catch(err: any){
            displayToast(err.reason as string, 'danger')
        }
    }

    const handleChangePasswordWithToken = async( clickEvent:React.FormEvent<HTMLElement>) => {
        clickEvent.preventDefault()
        try{
            if(newPassword !== confirmPassword){
                displayToast('Passwords do not match', 'danger')
            } else {
                const changeRequest: ChangePasswordWithToken = {
                    newPassword,
                    concreteType: 'org.sagebionetworks.repo.model.auth.ChangePasswordWithToken',
                    passwordChangeToken: token as PasswordResetSignedToken
                }
                await SynapseClient.changePasswordWithToken(changeRequest)
                    .then(() => {
                        displayToast("Successfully changed", 'success')
                    })
                    .then(()=> window.location.replace(props.returnToUrl))
            }
        } catch(err: any){
            displayToast(err.reason as string, 'danger')
        }
    }

    return(
        <div className="bootstrap-4-backport blue-background">
            {
                token ? <>
                    <form onSubmit={handleChangePasswordWithToken}>
                        <FormGroup controlId='newPassword'>
                            <FormLabel>New Password</FormLabel>
                            <FormControl 
                            type='password' 
                            onChange={e => setNewPassword(e.target.value)} 
                            value = {newPassword}
                            placeholder='Enter new password'
                            />
                        </FormGroup>
                        <FormGroup controlId='confirmPassword'>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl 
                            type='password' 
                            onChange={e => setConfirmPassword(e.target.value)} 
                            value = {confirmPassword}
                            placeholder='Confirm new password'
                            />
                        </FormGroup>
                        <Button className='btn-container'  variant='contained' type='submit' onSubmit={handleChangePasswordWithToken}>Change Password</Button>
                    </form>
                </> :
                <>
                    <Typography variant='headline1'>Reset your Password</Typography>
                    <Typography variant='body1'>Please enter your email address or Synapse user name and we'll send you instructions to reset your password</Typography>
                    <FormControl
                        onChange={e=>setUserName(e.target.value)}
                        value={userName}
                        placeholder='Email address-or-username'
                    />
                    <Button variant='contained' onClick={handleResetPassword}>Reset my password</Button>
                </>

            }
        </div>
    )
}