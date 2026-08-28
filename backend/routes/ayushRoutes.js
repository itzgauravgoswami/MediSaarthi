const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
  res.json({
    patientId: req.params.id,
    mode: "AYUSH",
    dashavidhaPariksha: {
      prakriti: "Pittaj-Kaphaj",
      vikriti: "Vata-Kaphaj Agni-mandya with Hridaya Shoola",
      sara: "Madhyama Sara",
      samhanana: "Madhyama",
      pramana: "Normal Height 172cm, Weight 78kg",
      satmya: "Sarva-rasa Satmya",
      sattva: "Madhyama Sattva",
      aharaShakti: "Abhavarana (Manda Agni)",
      vyayamaShakti: "Alpa",
      vaya: "Madhyama Vaya (45 yrs)"
    }
  });
});

module.exports = router;
