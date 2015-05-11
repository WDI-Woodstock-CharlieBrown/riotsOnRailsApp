class CreateRiots < ActiveRecord::Migration
  def change
    create_table :riots do |t|

      t.timestamps null: false
    end
  end
end
