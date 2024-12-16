const InputEmployee = ({ label, register, error, styles }) => {
    return (
        <div className={styles.inputDetails}>
            <label className={styles.inputLabel}>{label}</label>
            <input
                className={styles.input}
                {...register}
            />
            {error && <p className={styles.error}>{error}</p>} {/* Mensaje de error */}
        </div>
    );
};

export default InputEmployee;