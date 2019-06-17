class CreatePlaces < ActiveRecord::Migration[5.2]
  def change
    create_table :places do |t|
      t.string :title
      t.text :description
      t.point :coordinates
      t.references :user, index: true, null: false

      t.timestamps
    end
  end
end
