// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Penugasan {
    uint public jumlahTugas = 0;

    struct Tugas {
        uint id;
        string isiTugas;
        bool isSelesai;
        string owner; // Menyimpan pemilik tugas (Orang 1 atau Orang 2)
    }
    mapping(uint => Tugas) public daftarTugas;

    event TugasDibuat(uint id, string isiTugas, bool isSelesai, string owner);

    function buatTugas(string memory _isiTugas, string memory _owner) public {
        jumlahTugas++;
        daftarTugas[jumlahTugas] = Tugas(jumlahTugas, _isiTugas, false, _owner);
        emit TugasDibuat(jumlahTugas, _isiTugas, false, _owner);
    }

    event TugasDiselesaikan(uint id, bool isSelesai);

    function tugasSelesai(uint _id) public {
        Tugas storage _tugas = daftarTugas[_id];
        _tugas.isSelesai = !_tugas.isSelesai;
        daftarTugas[_id] = _tugas;
        emit TugasDiselesaikan(_id, _tugas.isSelesai);
    }
}
