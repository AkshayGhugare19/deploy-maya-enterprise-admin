import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Message, Dropdown } from 'semantic-ui-react';
import { apiGET, apiPUT } from '../../utils/apiHelper';
import { toast } from 'react-toastify';

const currencyOptions = [
    { key: 'usd', value: 'usd', text: 'US Dollar', symbol: '$' },
    { key: 'eur', value: 'eur', text: 'Euro', symbol: '€' },
    { key: 'inr', value: 'inr', text: 'Indian Rupee', symbol: '₹' },
    { key: 'usdt', value: 'usdt', text: 'Tether (USDT)', symbol: '₮' },
    // Add more currencies as needed
];

const GlobalConfigPage = () => {
    const [config, setConfig] = useState({
        deliveryCharges: 2.99,
        packagingCharges: 0,
        location: '',
        currencyId: ''
    });
    const [currencyConfig, setCurrencyConfig] = useState({
        currency: '',
        symbol: ''
    });
    console.log("pp",currencyConfig)
    const [loading, setLoading] = useState(false);
    const [currencyLoading, setCurrencyLoading] = useState(false);
    const [error, setError] = useState('');
    const [currencyError, setCurrencyError] = useState('');
    const [success, setSuccess] = useState('');
    const [configId, setConfigId] = useState('');

    useEffect(() => {
        const fetchConfig = async () => {
            setLoading(true);
            try {
                const response = await apiGET('/v1/global-config/get-config');
                const fetchedConfig = response.data.data.data[0];
                setConfigId(fetchedConfig?._id);
                setConfig({
                    deliveryCharges: fetchedConfig.deliveryCharges,
                    packagingCharges: fetchedConfig.packagingCharges,
                    location: fetchedConfig.location,
                    currencyId: fetchedConfig.currencyId
                });
                // Fetch currency by ID (assuming currency ID is stored in fetchedConfig.currencyId)
                fetchCurrency(fetchedConfig.currencyId);
            } catch (err) {
                setError('Failed to fetch configuration');
            }
            setLoading(false);
        };

        const fetchCurrency = async (currencyId) => {
            setCurrencyLoading(true);
            try {
                const response = await apiGET(`/v1/currency/get-currency/${currencyId}`);
                const currency = response.data.data.data;
                const selectedCurrency = currencyOptions.find(option => option.text === currency.name);
                setCurrencyConfig({
                    currency: selectedCurrency ? selectedCurrency.value : currency?.name,
                    symbol: currency.symbol
                });
            } catch (err) {
                setCurrencyError('Failed to fetch currency');
            }
            setCurrencyLoading(false);
        };

        fetchConfig();
    }, []);

    const handleChange = (e, { name, value }) => {
        setConfig({ ...config, [name]: value });
    };

    const handleCurrencyChange = (e, { value }) => {
        const selectedCurrency = currencyOptions.find(option => option.value === value);
        setCurrencyConfig({ currency: value, symbol: selectedCurrency.symbol });
    };

    const handleCurrencySymbolChange = (e, { name, value }) => {
        setCurrencyConfig({ ...currencyConfig, [name]: value });
    };

    const updateField = async (field) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const updatedConfig = { [field]: config[field] };
            await apiPUT(`/v1/global-config/update-config/${configId}`, updatedConfig);
            setSuccess(`Configuration for ${field} updated successfully`);
            toast.success(`Configuration for ${field} updated successfully`);
        } catch (err) {
            setError(`Failed to update configuration for ${field}`);
            toast.error(`Failed to update configuration for ${field}`);
        }
        setLoading(false);
    };

    const updateCurrency = async () => {
        setCurrencyLoading(true);
        setCurrencyError('');
        setSuccess('');
        try {
            const updatedCurrencyConfig = {
                name: currencyConfig.currency,
                symbol: currencyConfig.symbol
            };
            await apiPUT(`/v1/currency/update-currency/${config.currencyId}`, updatedCurrencyConfig);
            setSuccess('Currency configuration updated successfully');
            toast.success('Currency configuration updated successfully');
        } catch (err) {
            setCurrencyError('Failed to update currency configuration');
            toast.error('Failed to update currency configuration');
        }
        setCurrencyLoading(false);
    };

    return (
        <Container className='p-8'>
            <div className='w-[50%]'>
            <h2>Global Configuration</h2>
            {error && <Message negative>{error}</Message>}
            {success && <Message positive>{success}</Message>}
            <Form loading={loading} >
                <Form.Input
                    label="Delivery Charges"
                    name="deliveryCharges"
                    value={config.deliveryCharges}
                    onChange={handleChange}
                    action={
                        <Button onClick={() => updateField('deliveryCharges')} primary>
                            Update 
                        </Button>
                    }
                />
                <Form.Input
                    label="Packaging Charges"
                    name="packagingCharges"
                    value={config.packagingCharges}
                    onChange={handleChange}
                    action={
                        <Button onClick={() => updateField('packagingCharges')} primary>
                            Update
                        </Button>
                    }
                />
                <Form.Input
                    label="Location"
                    name="location"
                    value={config.location}
                    onChange={handleChange}
                    action={
                        <Button onClick={() => updateField('location')} primary>
                            Update
                        </Button>
                    }
                />
            </Form>
            <Form loading={currencyLoading} className='mt-4'>
                <Form.Field>
                    <label>Currency</label>
                    <Dropdown
                        placeholder='Select Currency'
                        fluid
                        selection
                        options={currencyOptions}
                        value={currencyConfig.currency}
                        onChange={handleCurrencyChange}
                    />
                </Form.Field>
                <Form.Input
                    label="Symbol"
                    name="symbol"
                    value={currencyConfig.symbol}
                    onChange={handleCurrencySymbolChange}
                />
                <Button onClick={updateCurrency} primary>
                    Update Currency
                </Button>
                {currencyError && <Message negative>{currencyError}</Message>}
            </Form>
            </div>
        </Container>
    );
};

export default GlobalConfigPage;
