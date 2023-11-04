export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tbl_kecamatan: {
        Row: {
          id: number
          nama: string | null
        }
        Insert: {
          id: number
          nama?: string | null
        }
        Update: {
          id?: number
          nama?: string | null
        }
        Relationships: []
      }
      tbl_kelola: {
        Row: {
          created_at: string
          evidence: string | null
          id: number
          operatorId: number | null
          tipe: string | null
          tpsId: number | null
          volume: number | null
        }
        Insert: {
          created_at?: string
          evidence?: string | null
          id?: number
          operatorId?: number | null
          tipe?: string | null
          tpsId?: number | null
          volume?: number | null
        }
        Update: {
          created_at?: string
          evidence?: string | null
          id?: number
          operatorId?: number | null
          tipe?: string | null
          tpsId?: number | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_kelola_operatorId_fkey"
            columns: ["operatorId"]
            referencedRelation: "tbl_operator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_kelola_tpsId_fkey"
            columns: ["tpsId"]
            referencedRelation: "tbl_tps"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_kelurahan: {
        Row: {
          id: number
          kecamatan_id: number | null
          nama: string
        }
        Insert: {
          id?: number
          kecamatan_id?: number | null
          nama?: string
        }
        Update: {
          id?: number
          kecamatan_id?: number | null
          nama?: string
        }
        Relationships: [
          {
            foreignKeyName: "tbl_kelurahan_kecamatan_id_fkey"
            columns: ["kecamatan_id"]
            referencedRelation: "tbl_kecamatan"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_olah: {
        Row: {
          created_at: string
          evidence: string | null
          id: number
          jenis: string | null
          kbs_id: number | null
          keterangan: string | null
          klasifikasi: string | null
          operatorId: number | null
          total: number | null
          tps_id: number | null
          tpsId: number | null
        }
        Insert: {
          created_at?: string
          evidence?: string | null
          id?: number
          jenis?: string | null
          kbs_id?: number | null
          keterangan?: string | null
          klasifikasi?: string | null
          operatorId?: number | null
          total?: number | null
          tps_id?: number | null
          tpsId?: number | null
        }
        Update: {
          created_at?: string
          evidence?: string | null
          id?: number
          jenis?: string | null
          kbs_id?: number | null
          keterangan?: string | null
          klasifikasi?: string | null
          operatorId?: number | null
          total?: number | null
          tps_id?: number | null
          tpsId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_olah_operatorId_fkey"
            columns: ["operatorId"]
            referencedRelation: "tbl_operator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_olah_tpsId_fkey"
            columns: ["tpsId"]
            referencedRelation: "tbl_tps"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_operator: {
        Row: {
          created_at: string
          email: string | null
          fullname: string | null
          id: number
          password: string | null
          phoneNumber: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          fullname?: string | null
          id?: number
          password?: string | null
          phoneNumber?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          fullname?: string | null
          id?: number
          password?: string | null
          phoneNumber?: string | null
        }
        Relationships: []
      }
      tbl_operator_tps: {
        Row: {
          affiliate: number | null
          created_at: string
          id: number
          latitude: string | null
          longitude: string | null
          operatorId: number | null
          tpsId: number | null
        }
        Insert: {
          affiliate?: number | null
          created_at?: string
          id?: number
          latitude?: string | null
          longitude?: string | null
          operatorId?: number | null
          tpsId?: number | null
        }
        Update: {
          affiliate?: number | null
          created_at?: string
          id?: number
          latitude?: string | null
          longitude?: string | null
          operatorId?: number | null
          tpsId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_operator_tps_affiliate_fkey"
            columns: ["affiliate"]
            referencedRelation: "tbl_tps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_operator_tps_operatorId_fkey"
            columns: ["operatorId"]
            referencedRelation: "tbl_operator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_operator_tps_tpsId_fkey"
            columns: ["tpsId"]
            referencedRelation: "tbl_tps"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_penanggung_jawab: {
        Row: {
          id: number
          nama: string
        }
        Insert: {
          id?: number
          nama: string
        }
        Update: {
          id?: number
          nama?: string
        }
        Relationships: []
      }
      tbl_registrasi_tps: {
        Row: {
          alamat: string | null
          approve: boolean | null
          created_at: string
          email: string | null
          id: number
          kelurahan_id: number | null
          latitude: string | null
          longitude: string | null
          photo: string | null
          pic: string | null
          rt: string | null
          rw: string | null
          subsektor_id: number | null
        }
        Insert: {
          alamat?: string | null
          approve?: boolean | null
          created_at?: string
          email?: string | null
          id?: number
          kelurahan_id?: number | null
          latitude?: string | null
          longitude?: string | null
          photo?: string | null
          pic?: string | null
          rt?: string | null
          rw?: string | null
          subsektor_id?: number | null
        }
        Update: {
          alamat?: string | null
          approve?: boolean | null
          created_at?: string
          email?: string | null
          id?: number
          kelurahan_id?: number | null
          latitude?: string | null
          longitude?: string | null
          photo?: string | null
          pic?: string | null
          rt?: string | null
          rw?: string | null
          subsektor_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_registrasi_tps_kelurahan_id_fkey"
            columns: ["kelurahan_id"]
            referencedRelation: "tbl_kelurahan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_registrasi_tps_subsektor_id_fkey"
            columns: ["subsektor_id"]
            referencedRelation: "tbl_subsektor"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_sektor: {
        Row: {
          id: number
          nama_sektor: string
        }
        Insert: {
          id?: number
          nama_sektor?: string
        }
        Update: {
          id?: number
          nama_sektor?: string
        }
        Relationships: []
      }
      tbl_subsektor: {
        Row: {
          id: number
          penanggungjawab_id: number | null
          sektor_id: number | null
          subsektor: string | null
        }
        Insert: {
          id?: number
          penanggungjawab_id?: number | null
          sektor_id?: number | null
          subsektor?: string | null
        }
        Update: {
          id?: number
          penanggungjawab_id?: number | null
          sektor_id?: number | null
          subsektor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_subsektor_penanggungjawab_id_fkey"
            columns: ["penanggungjawab_id"]
            referencedRelation: "tbl_penanggung_jawab"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_subsektor_sektor_id_fkey"
            columns: ["sektor_id"]
            referencedRelation: "tbl_sektor"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_tps: {
        Row: {
          alamat: string | null
          foto: string | null
          id: number
          id_fasilitas: string | null
          id_kecamatan: number | null
          id_kelurahan: string | null
          id_wilayah: number | null
          kepemilikan_lahan: string | null
          latitude: string | null
          lebar_lb: string | null
          longitude: string | null
          luas_lahan: string | null
          nama_tps: string
          panjang_lb: string | null
          peruntukan: string | null
          sampah_diangkut: string | null
          sampah_masuk: string | null
          sisa_lahan_tidak_ada_bangunan: string | null
          subsektor_id: number | null
          sumber_sampah: string | null
          type_tps: string | null
        }
        Insert: {
          alamat?: string | null
          foto?: string | null
          id?: number
          id_fasilitas?: string | null
          id_kecamatan?: number | null
          id_kelurahan?: string | null
          id_wilayah?: number | null
          kepemilikan_lahan?: string | null
          latitude?: string | null
          lebar_lb?: string | null
          longitude?: string | null
          luas_lahan?: string | null
          nama_tps?: string
          panjang_lb?: string | null
          peruntukan?: string | null
          sampah_diangkut?: string | null
          sampah_masuk?: string | null
          sisa_lahan_tidak_ada_bangunan?: string | null
          subsektor_id?: number | null
          sumber_sampah?: string | null
          type_tps?: string | null
        }
        Update: {
          alamat?: string | null
          foto?: string | null
          id?: number
          id_fasilitas?: string | null
          id_kecamatan?: number | null
          id_kelurahan?: string | null
          id_wilayah?: number | null
          kepemilikan_lahan?: string | null
          latitude?: string | null
          lebar_lb?: string | null
          longitude?: string | null
          luas_lahan?: string | null
          nama_tps?: string
          panjang_lb?: string | null
          peruntukan?: string | null
          sampah_diangkut?: string | null
          sampah_masuk?: string | null
          sisa_lahan_tidak_ada_bangunan?: string | null
          subsektor_id?: number | null
          sumber_sampah?: string | null
          type_tps?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_tps_id_wilayah_fkey"
            columns: ["id_wilayah"]
            referencedRelation: "tbl_wilayah"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_tps_subsektor_id_fkey"
            columns: ["subsektor_id"]
            referencedRelation: "tbl_subsektor"
            referencedColumns: ["id"]
          }
        ]
      }
      tbl_wilayah: {
        Row: {
          id: number
          nama_wilayah: string
        }
        Insert: {
          id?: number
          nama_wilayah?: string
        }
        Update: {
          id?: number
          nama_wilayah?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
