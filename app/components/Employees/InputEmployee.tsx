const InputEmployee = ({ label, register, error, styles, name }) => {
    return (
        <div className={styles.inputDetails}>
            <label className={styles.inputLabel}>{label}</label>
            <input
                name={name}
                className={styles.input}
                {...register}
            />
            {error && <p className={styles.error}>{error}</p>} {/* Mensaje de error */}
        </div>
    );
};

export default InputEmployee;