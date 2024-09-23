import { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
    const [paymentInfo, setPaymentInfo] = useState({
        externalIdentifier: uuidv4(),
        amount: '',
        currency: 'BRL',
        paymentMethod: 'PIX',
        customer: {
            documentNumber: '',
            firstName: '',
            lastName: ''
        }
    });

    const [paymentLink, setPaymentLink] = useState('');

    // Função para atualizar o estado corretamente, lidando com campos aninhados
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'firstName' || name === 'lastName' || name === 'documentNumber') {
            // Atualiza os campos dentro de 'customer'
            setPaymentInfo({
                ...paymentInfo,
                customer: {
                    ...paymentInfo.customer,
                    [name]: value
                }
            });
        } else if (name === 'amount') {
            // Substitui vírgulas por pontos no campo amount
            const normalizedValue = value.replace(',', '.');
            setPaymentInfo({
                ...paymentInfo,
                amount: normalizedValue
            });
        } else {
            // Atualiza os campos de nível superior
            setPaymentInfo({
                ...paymentInfo,
                [name]: value
            });
        }
    };

    const generatePaymentLink = async () => {
        try {
            // Configurar os headers
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Basic YnJhemlubzc3N19kZWZfdXNyOmJyYXppbm83NzdfZGVmX3B3'
            };

            // Faça a chamada para a API com os dados e os headers
            const response = await axios.post(
                'https://gambleguard.api.qa.orkestrapay.io/deposits',
                paymentInfo,
                { headers }
            );

            // Suponha que a API retorne o link de pagamento no campo 'url'
            const { url } = response.data.deposit.checkoutUrl;

            // Define o estado com o link de pagamento retornado
            setPaymentLink(url);
        } catch (error) {
            console.error('Erro ao gerar link de pagamento', error);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Gerador de Link de Pagamento</h1>
            <form>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={paymentInfo.customer.firstName}
                    onChange={handleChange}
                />
                <br />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={paymentInfo.customer.lastName}
                    onChange={handleChange}
                />
                <br />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={paymentInfo.amount}
                    onChange={handleChange}
                />
                <br />
                <input
                    type="text"
                    name="documentNumber"
                    placeholder="Document Number"
                    value={paymentInfo.customer.documentNumber}
                    onChange={handleChange}
                />
                <br />
                <button type="button" onClick={generatePaymentLink}>
                    Gerar Link de Pagamento
                </button>
            </form>

            {paymentLink && (
                <div>
                    <h3>Seu Link de Pagamento:</h3>
                    <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                        {paymentLink}
                    </a>
                    <br />
                    <button onClick={() => window.location.href = paymentLink}>
                        Ir para o Link de Pagamento
                    </button>
                </div>
            )}
        </div>
    );
}
