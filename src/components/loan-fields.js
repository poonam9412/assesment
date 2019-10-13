import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import './loan-field.css'
import { LoanAction } from '../redux/action/loan-action'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Slider from '@material-ui/core/Slider';


const styles = theme => ({
    slider: {
        width: '50%'
    },
    paperStyle: {
        height: 450,
        padding: 20
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '100%',
    },
    button: {
        margin: theme.spacing.unit,
    },
    SliderTrack: {
        height: 5,
    },

});

class LoanFields extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            interest: "",
            amount: "",
            disabled: false,
            monthlyPayment: undefined,
            rate: undefined
        }

    }


    handleAmount = (event) => {
        this.setState({
            amount: event.target.value,
            disabled: false
        })

    }

    handleInterest = (event) => {
        this.setState({
            interest: event.target.value,
            disabled: false
        })
    }
    handleSlider = (event, newValue) => {
        const loanValue = {
            amount: newValue,
            numMonths: this.state.interest
        }
        this.setState({
            amount: newValue,
            disabled: true,
            monthlyPayment: undefined,
            rate: undefined
        })
        if (this.state.interest) {
            this.props.dispatch(LoanAction(loanValue))
        }
    }

    handleLoan = () => {
        // console.log(value)
        const loanValue = {
            amount: this.state.amount,
            numMonths: this.state.interest
        }
        this.props.dispatch(LoanAction(loanValue))
        this.setState({
            disabled: true,
            monthlyPayment: undefined,
            rate: undefined
        })
    }
    handleSelect = (amount, duration, monthlyPayment, rate) => {
        this.setState({
            amount,
            interest: duration,
            monthlyPayment,
            rate
        })
    }
    handleSubmit = () => {
        console.log("submitted")
    }

    render() {

        const pastData = this.props.loanList ? (this.props.loanList || []).map((item, index) => {
            return (
                <div className="flex flex-row pointer" key={index} onClick={() => this.handleSelect(item.amount, item.duration,
                    item.intersetAmount, item.interestPercentage)}>
                    <div className="flex pa2"><span>Amount : - </span>{item.amount}</div>
                    <div className="flex pa2"><span>Duration : - </span>{item.duration}</div>
                </div>
            )
        }) : <div className="pa2"> <em>No Calculation is done</em></div>

        const monthlyPayment = this.state.monthlyPayment ? this.state.monthlyPayment : this.props.loanValue && this.props.loanValue.loanData && this.props.loanValue.loanData.monthlyPayment
            && this.props.loanValue.loanData.monthlyPayment.amount ? this.props.loanValue.loanData.monthlyPayment.amount :
            'NA'

        const interestRate = this.state.rate ? this.state.rate : this.props.loanValue && this.props.loanValue.loanData && this.props.loanValue.loanData.interestRate ?
            this.props.loanValue.loanData.interestRate : 'NA'
        return (
            <div>
                <article>
                    <header className="bg-gold sans-serif">
                        <div className="mw9 center pa4 pt5-ns ph7-l">
                            <h3 className="f2 f1-m f-headline-l measure-narrow lh-title mv0">
                                <span className="bg-black-90 lh-copy white pa1 tracked-tight">
                                    Calculate Loan amount
                                    </span>
                            </h3>

                        </div>
                    </header>
                    <div className="pa4 ph7-l georgia mw9-l center flex flex-row">
                        <div className="w-30 flex pr3">
                            <Paper className={this.props.classes.paperStyle} elevation={1}>
                                <h2>The Entered amount and Duration</h2>
                                {pastData}
                            </Paper>
                        </div>
                        <div className='flex'>
                            <Paper className={this.props.classes.paperStyle} elevation={1}>
                                <div className="flex flex-row">
                                    <ValidatorForm
                                        ref="form"
                                        onSubmit={this.handleSubmit}
                                        onError={errors => console.log(errors)}
                                        noValidate
                                    >
                                        <div className="flex flex-row">
                                            <div className="flex">
                                                <TextValidator
                                                    name="amount"
                                                    label="Amount"
                                                    value={this.state.amount}
                                                    onChange={this.handleAmount}
                                                    margin="normal"
                                                    variant="outlined"
                                                    validators={['required', 'isNumber', 'minNumber:500', 'maxNumber: 5000']}
                                                    errorMessages={['this field is required', 'Enter a Valid number', 'Amount should be between $500 and $5000', 'Amount should be between $500 and $5000']}
                                                    className={this.props.classes.textField}
                                                />
                                            </div>
                                            <div className="flex">
                                                <TextValidator
                                                    id="loanDuration"
                                                    name="loanDuration"
                                                    label="Loan Duration in months"
                                                    value={this.state.interest}
                                                    onChange={this.handleInterest}
                                                    margin="normal"
                                                    variant="outlined"
                                                    validators={['required', 'isNumber', 'minNumber:6', 'maxNumber: 24']}
                                                    errorMessages={['this field is required', 'Enter a valid number', "Month duration must be between 6 and 24", "Month duration must be between 6 and 24"]}
                                                    className={this.props.classes.textField}
                                                />
                                            </div>
                                            <div className="pa2">

                                                <Button type="submit" disabled={(!this.state.amount || !this.state.interest) ? true : this.state.disabled ? true : false} variant="contained" color="primary" onClick={this.handleLoan} className={this.props.classes.button}>
                                                    Calculate
      </Button>
                                            </div>
                                        </div>
                                    </ValidatorForm>
                                </div>
                                <div className="pa2">
                                    <p><strong><em>Or</em></strong></p>
                                    <h3>Select Amount from slider</h3>
                                    <Slider
                                        value={this.state.amount}
                                        onChange={this.handleSlider}
                                        aria-labelledby="input-slider"
                                        max={5000}
                                        classes={{ root: this.props.classes.slider, rail: this.props.classes.SliderTrack, track: this.props.classes.SliderTrack }}
                                    />
                                </div>
                                <div>
                                    <p><em>The Interest Rate and monthly payment for the given amount with given duration</em></p>
                                    <div className="pv2">
                                        <label>Monthly Payment: </label>
                                        <span>{monthlyPayment}</span>
                                    </div>
                                    <div className="pv2">
                                        <label>Interest Rate: </label>
                                        <span>{interestRate}</span>
                                    </div>
                                </div>

                            </Paper>
                        </div>
                    </div>
                </article>


            </div>
        )
    }
}

function mapStatetoProps(state) {
    return {
        loanValue: state.loanValue,
        loanList: state.loanValue && state.loanValue.loanList
    }
}

export default connect(mapStatetoProps)(withStyles(styles, { withTheme: true })(LoanFields));