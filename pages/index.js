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

            // Trata o erro para exibição na tela
            if (error.response) {
                // O servidor respondeu com um status diferente de 2xx
                setErrorMessage(`Erro: ${error.response.data.message || 'Erro desconhecido'}`);
            } else if (error.request) {
                // A requisição foi feita, mas não houve resposta
                setErrorMessage('Erro: Nenhuma resposta recebida do servidor. Verifique sua conexão.');
            } else {
                // Outro erro ocorreu
                setErrorMessage(`Erro: ${error.message}`);
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h1 style={styles.title}>Gerador de Link de Pagamento</h1>
                <form style={styles.form}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Nome"
                        value={paymentInfo.customer.firstName}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Sobrenome"
                        value={paymentInfo.customer.lastName}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Valor"
                        value={paymentInfo.amount}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        name="documentNumber"
                        placeholder="Número do Documento"
                        value={paymentInfo.customer.documentNumber}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <button type="button" onClick={generatePaymentLink} style={styles.button}>
                        Gerar Link de Pagamento
                    </button>
                </form>

                {/* Exibição da mensagem de erro, se houver */}
                {errorMessage && (
                    <div style={styles.errorContainer}>
                        <p style={styles.errorMessage}>{errorMessage}</p>
                    </div>
                )}

                {/* Exibe o link de pagamento, se gerado */}
                {paymentLink && (
                    <div style={styles.paymentSection}>
                        <h3 style={styles.paymentTitle}>Seu Link de Pagamento:</h3>
                        <a href={paymentLink} target="_blank" rel="noopener noreferrer" style={styles.paymentLink}>
                            {paymentLink}
                        </a>
                        <br />
                        <button onClick={() => window.location.href = paymentLink} style={styles.redirectButton}>
                            Ir para o Link de Pagamento
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '16px',
        outline: 'none',
        width: '100%',
    },
    button: {
        padding: '10px',
        marginTop: '20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    paymentSection: {
        marginTop: '30px',
        textAlign: 'center',
    },
    paymentTitle: {
        fontSize: '18px',
        marginBottom: '10px',
        color: '#333',
    },
    paymentLink: {
        fontSize: '16px',
        color: '#3498db',
        textDecoration: 'none',
        wordWrap: 'break-word',
    },
    redirectButton: {
        padding: '10px',
        marginTop: '10px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#008CBA',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    errorContainer: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#ffcccc',
        borderRadius: '5px',
    },
    errorMessage: {
        color: '#cc0000',
        fontSize: '14px',
    },
};
